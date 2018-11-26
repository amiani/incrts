import Lazy from 'lazy.js'
import uuidv4 from 'uuid/v4'

import { clamp } from './helpers'
import { TICKRATE } from './constants'
import {
  ProtoAssembler,
  ProtoCrucible,
  ProtoGenerator,
  ProtoPort
} from './pieces/prototypes'
import { ProtoQueue, ProtoStack, ProtoBuffer, ProtoDeviceMod } from  './components/prototypes'
import { ProtoOrder } from './objectives/prototypes'
import procs from './components/procedures'
import { units } from './pieces/units'

const allProcedures = Lazy(procs)
  .assign(units)
  .map(p => {
    p.id = uuidv4()
    return [p.id, p]
  })
  .toObject()

const data = {
  resources: {
    credits: 3200,
    creditIncome: 0,
    fabric: 3200,
    fabricRate: 0,
    maxFabricRate: 10,
    fabricPrice: 10,
    hardware: 1000,
    hardwareIncome: 0,
    devices: 0,
    synthetics: 0,
    energy: 10000,
    energyIncome: 0,
    drain: 5,
    productivity: 1,
  },

  assemblers: {},
  crucibles: {},
  generators: {},
  mods: {},

  procedures: allProcedures,
  allProcedures: allProcedures,

  queues: {},
  stacks: {},

  buffers: {},
  unitQueues: { tanks: [], },

  orders: {},
}

onmessage = e => {
  switch(e.data.sub) {
    case 'buildassembler':
      buildAssembler()
      break
    case 'buildcrucible':
      buildCrucible()
      break
    case 'buildgenerator':
      buildGenerator()
      break
    case 'enqueue':
      enqueue(e.data.body)
      break
    case 'enstack':
      enstack(e.data.body)
      break
    case 'buy':
      buy(e.data.body)
      break
    case 'toggleloop':
      toggleLoop(e.data.body)
      break
    case 'togglepower':
      togglePower(e.data.body)
      break
    case 'dispatch':
      dispatch(e.data.body)
      break
    case 'makeorder':
      makeOrder(e.data.body)
      break
    case 'cancelorder':
      cancelOrder(e.data.body)
      break
    case 'setdemand':
      setDemand(e.data.body)
      break
    case 'addmod':
      addMod(e.data.body)
      break
    case 'updatemod':
      updateMod(e.data.body)
      break
    case 'setfabricrate':
      setFabricRate(e.data.body)
      break
    case 'addprocedure':
      addProcedure(e.data.body)
      break
    default:
      console.log(`Received message with no listener: ${e.data.sub}`)
      break
  }
}

let tick = 0
const update = () => {
  updateResources()
  updateQueues()
  updateStacks
  updateBuffers()
  postMessage({
    sub: 'update',
    body: {
      resources: data.resources,
      queues: data.queues,
      stacks: data.stacks,
      buffers: data.buffers,
    }
  })
  tick % 10 == 0 && updateOrders()
  tick++
}

setInterval(update, TICKRATE)

const updateResources = () => {
  const res = data.resources
  res.credits -= res.fabricRate/TICKRATE * res.fabricPrice
  if (res.credits < 0) {
    res.credits = 0
  } else {
    res.fabric += res.fabricRate/TICKRATE
  }
  res.energyIncome = Lazy(data.generators)
    .pluck('output')
    .sum()
  res.drain = Lazy(data.assemblers)
    .merge(data.crucibles)
    .pluck('drain')
    .sum()
  let nextEnergy = res.energy + res.energyIncome - res.drain
  res.energy = nextEnergy > 0 ? nextEnergy : 0
  res.productivity = res.energy > res.drain || !res.drain
    ? 1
    : res.energyIncome / res.drain
}

const setFabricRate = ({ rate }) => {
  data.resources.fabricRate = clamp(rate, 0, data.resources.maxFabricRate)
}

const updateApparatus = apparatus => {
  apparatus.drain = apparatus.baseDrain + apparatus.mods.reduce((acc, m) => (
    acc + (m.drain ? m.drain : 0)
  ), 0)
  apparatus.procedures = apparatus.baseProcedures.concat(
    apparatus.mods.reduce((acc, id) => acc.concat(data.mods[id].procedures), [])
  )
  postMessage({
    sub: 'apparatus',
    body: apparatus
  })
}

const buy = want => {
  const wantSeq = Lazy(want)
  const cost = wantSeq
    .reduce((acc, amt, name) => {
      Lazy(data.resources[`${name}Price`])
        .each((price, priceName) => {
          !acc[priceName] && (acc[priceName] = 0)
          acc[priceName] += amt * price
        })
      return acc
    }, {})
  if (spend(cost)) {
    wantSeq.each((amt, name) => { data.resources[name] += amt })
  }
}

const updateQueues = () => {
  Lazy(data.queues)
    .each(q => {
      const item = q.procedures[q.currProc]
      if (item) {
        q.progress += q.buildRate * item.buildRate + 10
        if (q.progress >= 100) {
          if (item.isUnit) {
            const unit = { ...item }
            unit.id = uuidv4()
            const bufferId = data.assemblers[q.ownerId].bufferId
            const buffer = data.buffers[bufferId]
            !buffer.units[unit.type] && (buffer.units[unit.type] = [])
            buffer.units[unit.type].push(unit)
          } else {
            Lazy(item.output).each((amt, name) => data.resources[name] += amt)
          }
          q.currProc++
          q.currProc >= q.procedures.length && (q.currProc = 0)
          q.progress = 0
        }
      }
    })
}

const updateStacks = () => {
  //TODO; implement this
}

const dispatch = ({ bufferId, orderId }) => {
  const buffer = data.buffers[bufferId]
  const order = data.orders[orderId]
  Lazy(order.want)
    .each((numWanted, unitType) => {
      !order.units[unitType] && (order.units[unitType] = [])
      const orderUnits = order.units[unitType]
      const bufferUnits = buffer.units[unitType] || []
      const numNeeded = numWanted - (orderUnits ? orderUnits.length : 0)
      const numTaking = numNeeded > bufferUnits ? bufferUnits : numNeeded
      order.units[unitType] = orderUnits.concat(bufferUnits.splice(0, numTaking))
    })
  postMessage({
    sub: 'order',
    body: order
  })
}

const setDemand = ({ bufferId, unitType, amt }) => {
  const buffer = data.buffers[bufferId]
  const nextAmt = amt < 0 ? 0 : amt
  const prevAmt = buffer.demand[unitType]
  buffer.demand[unitType] = nextAmt
  if (buffer.units[unitType].length < nextAmt) {
    if (!data.unitQueues[unitType].includes(bufferId))
      data.unitQueues[unitType].push(bufferId)
  }
  if (prevAmt > 0 && nextAmt <= 0) {
    const queue = Lazy(data.unitQueues[unitType])
      .reject(h => h === bufferId)
      .toArray()
    data.unitQueues[unitType] = queue
  }
}

const updateBuffers = () => {
  Lazy(data.buffers)
    .where({ isSource: true })
    .pluck('units')
    .each(units => Lazy(units)
      .each((unitArr, unitType) => {
        if (Lazy(unitArr).isEmpty())
          return
        const actualQueue = data.unitQueues[unitType]
        if (actualQueue.length > 0) {
          const unit = unitArr.shift()
          const firstBuffer = data.buffers[actualQueue.shift()]
          unit.ownerId = firstBuffer.ownerId
          !firstBuffer.units[unitType] && (firstBuffer.units[unitType] = [])
          firstBuffer.units[unitType].push(unit)
          if (firstBuffer.units[unitType].length < firstBuffer.demand[unitType]) {
            actualQueue.push(firstBuffer.id)
          }
        }
      })
    )
}

const updateOrders = () => {
  const now = Date.now()
  Lazy(data.orders)
    .each(o => {
      if (o.want) {
        const totalUnitsLeft = Lazy(o.want)
          .reduce((acc, curr, currType) => {
            let unitsLeft = curr - (o.units[currType] ? o.units[currType].length : 0)
            unitsLeft = unitsLeft >= 0 ? unitsLeft : 0
            return acc + unitsLeft
          }, 0)
        if (o.deadline.valueOf() - now <= 0) {
          o.want = null
        } else if (totalUnitsLeft <= 0) {
          data.credits += 100
          o.deadline = null
        }
        postMessage({
          sub: 'orders',
          body: data.orders
        })
      }
    })
}

const addMod = ({ apparatusId, type, mod }) => {
  data.mods[mod.id] = mod
  const apparatus = data[type][apparatusId]
  apparatus.mods.push(mod.id)
  postMessage({
    sub: 'controlMap',
    body: {
      id: mod.id,
      controlName: mod.controlName
    }
  })
  updateApparatus(apparatus)
  postMessage({
    sub: mod.id,
    body: mod
  })
}

const updateMod = body => {
  const mod = data.mods[body.modId]
  mod.testknobvalue = body.testknobvalue
  if (mod.testknobvalue > 100) mod.testknobvalue = 100
  if (mod.testknobvalue < 0) mod.testknobvalue = 0
  postMessage({
    sub: mod.id,
    body: mod
  })
}

const buildAssembler = () => {
  const assembler = new ProtoAssembler()
  const buffer = makeBuffer(assembler.id, true)
  const queue = makeQueue(assembler.id)
  assembler.bufferId = buffer.id
  assembler.queueId = queue.id
  buildApparatus(assembler)
}

const buildCrucible = () => {
  const crucible = new ProtoCrucible()
  const stack = makeStack(crucible.id)
  crucible.stack = stack.id
  buildApparatus(crucible)
}

const buildGenerator = () => {
  buildApparatus(new ProtoGenerator())
}

const buildPort = () => {
  const port = new ProtoPort()
  const buffer = makeBuffer(port.id, false)
  port.bufferId = buffer.id
  buildApparatus(port)
}

const buildApparatus = apparatus => {
  spend(apparatus.cost)
  data[apparatus.type][apparatus.id] = apparatus
  postMessage({ sub: 'apparati', body: { [apparatus.type]: data[apparatus.type] } })
}

const makeBuffer = (ownerId, isSource) => {
  const buffer = new ProtoBuffer(ownerId, isSource)
  data.buffers[buffer.id] = buffer
  return buffer
}

const makeQueue = ownerId => {
  const queue = new ProtoQueue(ownerId)
  data.queues[queue.id] = queue
  return queue
}

const makeStack = ownerId => {
  const stack = new ProtoStack(ownerId)
  data.stacks[stack.id] = stack
  return stack
}

const addProcedure = procId => {
  postMessage({ sub: 'procedures', body: data.procedures })
}

let orderNumber = 1
const makeOrder = () => {
  const order = new ProtoOrder(
    orderNumber,
    { tanks: 10 },
    new Date(Date.now() + 5000)
  )
  const buffer = makeBuffer(order.id)
  order.bufferId = buffer.id
  data.orders[order.id] = order
  postMessage({ sub: 'orders', body: data.orders })
  orderNumber++
}

const cancelOrder = orderId => {
  delete data.orders[orderId]
  postMessage({ sub: 'orders', body: data.orders })
}

const enqueue = ({ queueId, procId }) => {
  const queue = data.queues[queueId]
  if (queue.procedures.length >= queue.maxLength) {
    //respond with error
    return
  }
  const procedure = { ...data.procedures[procId] }
  if (procedure.cost) {
    spend(procedure.cost)
  }
  queue.procedures.push(procedure)
}

const enstack = ({ stackId, procId }) => {
  const stack = data.stacks[stackId]
  if (stack.procedures.length >= stack.maxLength) {
    //respond with error
    return
  }
  const procedure = { ...data.procedures[procId] }
  const lazyProcedures = Lazy(stack.procedures)
  const sumPriorities = lazyProcedures.sum('priority') + 10
  lazyProcedures.each(p => p.priority = 100*p.priority/sumPriorities)
  procedure.priority = 1000/sumPriorities
  stack.procedures[procId] = procedure
}

const toggleLoop = ({ id }) => { data.queues[id].loop = !data.queues[id].loop }

const togglePower = ({ apparatusId }) => {
  const assembler = data.assemblers[apparatusId]
  assembler.status = !assembler.status
  postMessage({
    sub: 'apparatus',
    body: assembler
  })
}

const spend = cost => {
  const costSeq = Lazy(cost)
  if (canAfford(costSeq)) {
    costSeq
      .each((amt, name) => { data.resources[name] -= amt })
    return true
  } else {
    //respond with error
    return false
  }
}

const canAfford = costSeq => costSeq.every((amt, name) => data.resources[name] >= amt)
