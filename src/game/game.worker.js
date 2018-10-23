import Lazy from 'lazy.js'

import { TICKRATE } from './constants'
import { ProtoFactory, ProtoAssembler, ProtoGenerator } from './pieces/prototypes'
import { ProtoBuildQueue, ProtoHangar } from  './components/prototypes'
//import { ProtoBattlefield } from './objectives/Battlefield'
import Order from './objectives/Order'

const data = {
  resources: {
    credits: 3200,
    creditIncome: 0,
    fabric: 3200,
    fabricIncome: 0,
    fabricPrice: { credits: 10 },
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
  updateBuildQueues()
  updateHangars()
  updateOrders()
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
      buildGenerator()
      break
    case 'enqueue':
      enqueue(e.data.body)
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
    default:
      console.log(`Received message with no listener: ${e.data.name}`)
      break
  }
}

setInterval(update, TICKRATE);

const updateResources = () => {
  data.resources.energyIncome = Lazy(data.generators)
    .pluck('output')
    .sum()
  data.resources.drain = Lazy(data.factories)
    .merge(data.assemblers)
    .pluck('drain')
    .sum()
  let nextEnergy = data.resources.energy + data.resources.energyIncome - data.resources.drain
  data.resources.energy = nextEnergy > 0 ? nextEnergy : 0
  data.resources.productivity = data.resources.energy > data.resources.drain || !data.resources.drain
    ? 1
    : data.resources.energyIncome / data.resources.drain
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

const dispatch = ({ hangarId }) => {
  const hangar = data.hangars[hangarId]
  data.orders[hangar.ownerId].dispatch(hangar.units)
  hangar.units = { tanks: [] }
}

const updateHangars = () => {
  Lazy(data.hangars)
    .where({ isSource: true })
    .pluck('units')
    .each(units => Lazy(units)
      .each((unitArr, unitType) => {
        if (Lazy(unitArr).isEmpty())
          return
        const actualQueue = data.unitQueues[unitType]
        if (actualQueue.length > 0) {
          const unit = unitArr.shift()
          const firstHangar = hangars[actualQueue.shift()]
          unit.ownerId = firstHangar.ownerId
          !firstHangar.units[unitType] && (firstHangar.units[unitType] = [])
          firstHangar.units[unitType].push(unit)
          if (firstHangar.units[unitType].length < firstHangar.demand[unitType]) {
            actualQueue.push(firstHangar.id)
          }
        }
      })
    )
}

const updateOrders = () => Lazy(data.orders).each(o => o.update())

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

const makeOrder = () => {
  const order = new Order()
  const hangar = makeHangar(order.id)
  order.hangarId = hangar.id
  data.orders[order.id] = order
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

const toggleLoop = ({ id }) => { data.buildQueues[id].loop = !data.buildQueues[id].loop }

const togglePower = ({ buildingId }) => data.factories[buildingId].status = !data.factories[buildingId].status

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
