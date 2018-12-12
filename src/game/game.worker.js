import Lazy from 'lazy.js'
import uuidv4 from 'uuid/v4'
import solver from 'javascript-lp-solver'

import { clamp } from './helpers'
import { TICKRATE } from './constants'
import {
  ProtoAssembler,
  ProtoCrucible,
  ProtoPreaccelerator,
  ProtoPort
} from './pieces/prototypes'
import { ProtoQueue, ProtoStack, ProtoBuffer, ProtoDeviceMod } from  './components/prototypes'
import { ProtoTransfer } from './objectives/prototypes'
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
  preaccelerators: {},
  mods: {},

  procedures: allProcedures,
  allProcedures: allProcedures,

  queues: {},
  stacks: {},

  buffers: {},
  unitQueues: { tanks: [], },

  contracts: {},
  transfers: {},
}

const handlers = {}
onmessage = e => handlers[e.data.sub](e.data.body)

const ticksPerTransfersUpdate = 10
const ticksPerNewContract = 100
let tick = 0
const update = () => {
  updateResources()
  updateAssemblers(tick)
  updateStacks()
  tick % ticksPerTransfersUpdate == 0 && Object.keys(data.transfers).length > 0 && updateTransfers(tick)
  tick % ticksPerNewContract == 0 && Object.keys(data.contracts).length < 15 && makeContract()
  postMessage({
    sub: 'update',
    body: {
      resources: data.resources,
      queues: data.queues,
      stacks: data.stacks,
      buffers: data.buffers,
      assemblers: data.assemblers
    }
  })
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
  res.energyIncome = Lazy(data.preaccelerators)
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

handlers.setFabricRate = ({ rate }) => {
  data.resources.fabricRate = clamp(rate, 0, data.resources.maxFabricRate)
}

const updateApparatus = apparatus => {
  apparatus.drain = apparatus.baseDrain + apparatus.mods.reduce((acc, m) => (
    acc + (m.drain ? m.drain : 0)
  ), 0)
}

let assembler
const k = 1
const maxMag = 50
const minMag = 0.000001
const cartesianToMagnitude = (x, y) => Math.sqrt(x*x + y*y)

const updateAssemblers = tick => {
  updateQueues(tick)
  updateBuffers(tick)
  for (const assId in data.assemblers) {
    assembler = data.assemblers[assId]
    const { position: p, velocity: v } = assembler.oscillator
    const g = assembler.harm.value * .05
    const aX = -k*p.x
    const aY = -k*p.y
    const dampX = -g*v.x
    const dampY = -g*v.y
    const nextVX = v.x + (aX + dampX) * 1
    const nextVY = v.y + (aY + dampY) * 1
    let nextPX = p.x + nextVX * 1
    let nextPY = p.y + nextVY * 1
    const posMag = cartesianToMagnitude(nextPX, nextPY)
    if (posMag > maxMag) {
      nextPX *= maxMag/posMag
      nextPY *= maxMag/posMag
    }
    if (posMag < minMag) {
      p.x = 0
      p.y = 0
    } else {
      p.x = nextPX
      p.y = nextPY
    }

    if (cartesianToMagnitude(nextVX, nextVY) < minMag) {
      v.x = 0
      v.y = 0
    } else {
      v.x = nextVX
      v.y = nextVY
    }
  }
}

handlers.buy = want => {
  const lazyWant = Lazy(want)
  const cost = lazyWant
    .reduce((acc, amt, name) => {
      Lazy(data.resources[`${name}Price`])
        .each((price, priceName) => {
          !acc[priceName] && (acc[priceName] = 0)
          acc[priceName] += amt * price
        })
      return acc
    }, {})
  if (spend(cost)) {
    lazyWant.each((amt, name) => { data.resources[name] += amt })
  }
}

const updateQueues = () => {
  Lazy(data.queues)
    .each(q => {
      const assembler = data.assemblers[q.ownerId]
      const buffer = data.buffers[assembler.bufferId]
      const proc = q.procedures[q.currProc]
      const totalUnits = Lazy(buffer.units)
        .reduce((acc, u) => acc + u.length, 0)
      if (totalUnits < buffer.capacity && proc) {
        q.progress += assembler.speed.value * assembler.oscillator.sync / 50
        if (q.progress >= 100) {
          const unit = { ...proc }
          unit.id = uuidv4()
          !buffer.units[unit.type] && (buffer.units[unit.type] = [])
          buffer.units[unit.type].push(unit)

          q.currProc = (q.currProc + 1) % q.procedures.length
          q.progress = 0
        }
      }
    })
}

const updateBuffers = tick => {
  const ticksBetweenUpdates = 1
  if (tick % ticksBetweenUpdates === 0) {
    Lazy(data.buffers)
      .each(b => {
        Lazy(b.units).each((arr, unitType) => {
          !b.unitCounts[unitType] && (b.unitCounts[unitType] = [])
          b.unitCounts[unitType][tick/ticksBetweenUpdates] = arr.length
        })
      })
  }
}

const updateStacks = () => {
  //TODO; implement this
}

const updateTransfers = tick => {
  Lazy(data.transfers)
    .each(t => {
      t.period--
      if (t.period <= 0) {
        delete data.transfers[t.id]
        return
      }
      data.resources.credits += t.reward
    })

  const variables = {}
  const constraints = {
    network: { max: 100 },
    tanks: { equal: 0 }
  }
  for (const transferId in data.transfers) {
    const transfer = data.transfers[transferId]
    constraints[transferId] = { max: transfer.maxRate }
    for (const unit in transfer.rates) {
      const transferUnit = transfer.id + ',transfers,' + unit
      variables[transferUnit] = {
        [transferId]: 1,
        [unit]: 1,
        reward: 1,
      }
    }
  }
  for (const bufferId in data.buffers) {
    const buffer = data.buffers[bufferId]
    constraints[bufferId] = { max: buffer.maxRate }
    if (Object.keys(buffer.units).length > 0) {
      for (const unit in buffer.units) {
        const bufferUnit = buffer.id + ',buffers,' + unit
        constraints[bufferUnit] = { max: buffer.units[unit].length }
        variables[bufferUnit] = {
          [bufferUnit]: 1,
          [bufferId]: 1,
          [unit]: -1,
          network: 1,
        }
      }
    }
  }
  const model = {
    optimize: 'reward',
    opType: 'max',
    constraints,
    variables,
  }
  const result = solver.Solve(model)
  for (const clientUnit in variables) {
    if (result[clientUnit]) {
      const [clientId, clientType, unit] = clientUnit.split(',')
      if (clientType === 'buffers') {
        data.buffers[clientId].units[unit] = data.buffers[clientId].units[unit]
          .slice(result[clientUnit])
      } else {
        data.transfers[clientId].rates[unit].currRate = result[clientUnit]
      }
    }
  }

  postMessage({
    sub: 'transfers',
    body: data.transfers
  })
}

handlers.tuneAssembler = ({ assemblerId, ...controlSettings }) => {
  const ass = data.assemblers[assemblerId]
  let newValue
  let assControl
  for (const control in controlSettings) {
    newValue = controlSettings[control]
    assControl = ass[control]
    if (newValue <= assControl.max && newValue >= assControl.min)
      assControl.value = newValue
  }
}

handlers.addMod = ({ apparatusId, type, mod }) => {
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

handlers.tuneMod = body => {
  const mod = data.mods[body.modId]
  mod.testknobvalue = body.testknobvalue
  if (mod.testknobvalue > 100) mod.testknobvalue = 100
  if (mod.testknobvalue < 0) mod.testknobvalue = 0
  postMessage({
    sub: mod.id,
    body: mod
  })
}

handlers.buildAssembler = () => {
  const assembler = new ProtoAssembler()
  const buffer = makeBuffer(assembler.id)
  const queue = makeQueue(assembler.id)
  assembler.bufferId = buffer.id
  assembler.queueId = queue.id
  buildApparatus(assembler)
}

handlers.buildCrucible = () => {
  const crucible = new ProtoCrucible()
  const stack = makeStack(crucible.id)
  crucible.stackId = stack.id
  buildApparatus(crucible)
}

handlers.buildPreaccelerator = () => {
  buildApparatus(new ProtoPreaccelerator())
}

const buildApparatus = apparatus => {
  spend(apparatus.cost)
  data[apparatus.type][apparatus.id] = apparatus
  postMessage({ sub: 'apparati', body: { [apparatus.type]: data[apparatus.type] } })
}

const makeBuffer = ownerId => {
  const buffer = new ProtoBuffer(ownerId)
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

handlers.addProcedure = procId => {
  postMessage({ sub: 'procedures', body: data.procedures })
}

let contractNumber = 1
const makeContract = () => {
  const contract = new ProtoTransfer(
    contractNumber,
    30,
    2,
    { tanks: { desiredRate: 1, currRate: 0 } },
    1
  )
  data.contracts[contract.id] = contract
  postMessage({ sub: 'contracts', body: data.contracts })
  contractNumber++
}
handlers.makeContract = makeContract

handlers.acceptContract = ({ contractId }) => {
  const contract = data.contracts[contractId]
  data.transfers[contractId] = contract
  delete data.contracts[contractId]
  postMessage({ sub: 'contracts', body: data.contracts })
  postMessage({ sub: 'transfers', body: data.transfers })
}

handlers.cancelOrder = orderId => {
  delete data.orders[orderId]
  postMessage({ sub: 'orders', body: data.orders })
}

handlers.enqueue = ({ queueId, procId }) => {
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

handlers.enstack = ({ stackId, procId }) => {
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
