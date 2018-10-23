import Lazy from 'lazy.js'

import { TICKRATE } from './constants'
import { ProtoFactory, ProtoAssembler, ProtoGenerator } from './pieces/prototypes'
import { ProtoBuildQueue, ProtoHangar } from  './components/prototypes'
  /*
import { ProtoBattlefield } from './objectives/Battlefield'
import Order from './objectives/Order'
*/

const data = {
  resources: {
    credits: 3200,
    creditIncome: 0,
    fabric: 3200,
    fabricIncome: 0,
    hardware: 1000,
    hardwareIncome: 0,
    devices: 0,
    synthetics: 0,
    energy: 10000,
    energyIncome: 0,
    drain: 5,
    productivity: 1,
  },

  factories: {},
  assemblers: {},
  generators: {},

  buildQueues: {},

  hangars: {},
  unitQueues: { tanks: [], },

  orders: {},
}

const update = () => {
  updateResources()
  postMessage({
    name: 'update',
    body: {
      resources: data.resources,
      buildQueues: data.buildQueues,
    }
  })
}

onmessage = e => {
  switch(e.data.name) {
    case 'buildfactory':
      buildFactory()
      break
    case 'buildassembler':
      buildAssembler()
      break
    case 'buildgenerator':
      console.log(global)
      self.buildGenerator()
      break
    case 'enqueue':
      enqueue(e.data.body)
      break
    default:
      break
  }
}

setInterval(update, TICKRATE);

const updateResources = () => {
  let nextEnergy = data.resources.energy + data.resources.energyIncome - data.resources.drain
  data.resources.energy = nextEnergy > 0 ? nextEnergy : 0
  data.resources.productivity = data.resources.energy > data.resources.drain || !data.resources.drain
    ? 1
    : data.resources.energyIncome / data.resources.drain
}

const updateBuildQueues = () => {
  Lazy(data.buildQueues)
    .each(buildQ => {
      //add progress
      if (buildQ.progress >= 100) {
        if (item.isUnit) {
          const hangarId = data.factores[item.ownerId].hangarId
          const hangar = data.hangars[hangarId]
          !hangar.units[item.type] && (hangar.units[item.type] = [])
          hangar.units[item.type].push(item)
        } else {
          Lazy(item.output).each((amt, name) => data.resources[name] += amt)
        }
        buildQ.progress = 0
        buildQ.items.shift()
      }
    })
}

const mutateWithResult = (prevState, nextState, item) => {
  if (item.isUnit) {
    !nextState.hangars && (nextState.hangars = this.copyHangars(prevState.hangars))
    const hangarId = prevState.factories[item.ownerId].hangarId
    const hangar = nextState.hangars[hangarId]
    !hangar.units[item.type] && (hangar.units[item.type] = [])
    hangar.units[item.type].push(item)
  } else {
    Lazy(item.output).each((amt, name) => {
      nextState[name] = (nextState[name] ? nextState[name] : prevState[name]) + amt
    })
  }
}

const completeBuild = buildQueue => {
  buildQueue.progress = 0
  buildQueue.items.shift()
}

const buildFactory = () => {
  const factory = new ProtoFactory()
  const hangar = makeHangar(factory.id, true)
  const buildQ = makeBuildQueue(factory.id)
  factory.hangarId = hangar.id
  factory.buildQueueId = buildQ.id
  buildBuilding(factory)
  postMessage({ name: 'buildings', body: { factories: data.factories } })
}

const buildAssembler = () => {
  const assembler = new ProtoAssembler()
  const buildQ = makeBuildQueue(assembler.id)
  assembler.buildQueueId = buildQ.id
  buildBuilding(assembler)
  postMessage({ name: 'buildings', body: { assemblers: data.assemblers } })
}

const buildGenerator = () => {
  buildBuilding(new ProtoGenerator())
  postMessage({ name: 'buildings', body: { generators: data.generators } })
}

const buildBuilding = building => {
  spend(building.cost)
  data[building.type][building.id] = building
}

const makeHangar = (ownerId, isSource) => {
  const hangar = new ProtoHangar(ownerId, isSource)
  data.hangars[hangar.id] = hangar
  return hangar
}

const makeBuildQueue = ownerId => {
  const buildQ = new ProtoBuildQueue(ownerId)
  data.buildQueues[buildQ.id] = buildQ
  return buildQ
}

const enqueue = ({ buildQId, item }) => {
  const buildQ = data.buildQueues[buildQId]
  if (buildQ.items.length >= buildQ.maxLength) {
    //respond with error
    return
  }
  if (item.cost) {
    spend(item.cost)
  }
  buildQ.items.push(item)
}

const spend = cost => {
  const costSeq = Lazy(cost)
  if (canAfford(costSeq)) {
    costSeq
      .each((amt, name) => { data.resources[name] -= amt })
  } else {
    //respond with error
  }
}

const canAfford = costSeq => costSeq.every((amt, name) => data.resources[name] >= amt)
