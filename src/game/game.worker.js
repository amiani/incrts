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
  postMessage({ name: 'update', body: data.resources })
}

onmessage = e => {
  switch(e.data.name) {
    case 'buildfactory':
      buildFactory()
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
  postMessage({ name: 'buildings', body: { assmeblers: data.assmeblers } })
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
  }
  if (item.cost) {
    spend(item.cost)
  }
  buildQ.items.push(item)
  postMessage({ name: 'buildqueues', body: { [buildQId]: buildQ } })
}

const spend = cost => {
  const costSeq = Lazy(cost)
  if (canAfford(costSeq)) {
    costSeq
      .each((amt, name) => { data.resources[name] -= amt })
  }
}

const canAfford = costSeq => costSeq.every((amt, name) => data.resources[name] >= amt)
