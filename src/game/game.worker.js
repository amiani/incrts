import Lazy from 'lazy.js'
import uuidv4 from 'uuid/v4'
import solver from 'javascript-lp-solver'

import { clamp } from './helpers'
import { TICKRATE } from './constants'
import {
  ProtoAssembler,
  ProtoCrucible,
  ProtoGenerator,
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
  generators: {},
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
    case 'makecontract':
      makeContract(e.data.body)
      break
    case 'acceptcontract':
      acceptContract(e.data.body)
      break
    case 'canceltransfer':
      cancelTransfer(e.data.body)
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
  updateBuffers(tick)
  postMessage({
    sub: 'update',
    body: {
      resources: data.resources,
      queues: data.queues,
      stacks: data.stacks,
      buffers: data.buffers,
    }
  })
  //detect empty transfers better
  tick % 10 == 0 && Object.keys(data.transfers).length > 0 && updateTransfers()
  tick % 100 == 0 && makeContract()
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
      const proc = q.procedures[q.currProc]
      if (proc) {
        q.progress += q.buildRate * proc.buildRate + 40
        if (q.progress >= 100) {
          const unit = { ...proc }
          unit.id = uuidv4()
          const bufferId = data.assemblers[q.ownerId].bufferId
          const buffer = data.buffers[bufferId]
          !buffer.units[unit.type] && (buffer.units[unit.type] = [])
          buffer.units[unit.type].push(unit)

          q.currProc = (q.currProc + 1) % q.procedures.length
          q.progress = 0
        }
      }
    })
}

const updateStacks = () => {
  //TODO; implement this
}

const updateBuffers = tick => {
  const ticksBetweenUpdates = 5
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

const updateTransfers = () => {
  let transferIndex = 0
  const transferQueue = []
  Lazy(data.transfers)
    .each(t => {
      t.period--
      if (t.period <= 0) {
        delete data.transfers[t.id]
        return
      }
      transferQueue.push(t)
      data.resources.credits += t.reward
    })

  const variables = {}
  const constraints = {
    network: { max: 10 },
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
  const buffer = makeBuffer(assembler.id)
  const queue = makeQueue(assembler.id)
  assembler.bufferId = buffer.id
  assembler.queueId = queue.id
  buildApparatus(assembler)
}

const buildCrucible = () => {
  const crucible = new ProtoCrucible()
  const stack = makeStack(crucible.id)
  crucible.stackId = stack.id
  buildApparatus(crucible)
}

const buildGenerator = () => {
  buildApparatus(new ProtoGenerator())
}

const buildPort = () => {
  const port = new ProtoPort()
  const buffer = makeBuffer(port.id)
  port.bufferId = buffer.id
  buildApparatus(port)
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

const addProcedure = procId => {
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

const acceptContract = ({ contractId }) => {
  const contract = data.contracts[contractId]
  data.transfers[contractId] = contract
  delete data.contracts[contractId]
  postMessage({ sub: 'contracts', body: data.contracts })
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
