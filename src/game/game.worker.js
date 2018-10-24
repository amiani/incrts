import Lazy from 'lazy.js'

import { TICKRATE } from './constants'
import { ProtoFactory, ProtoAssembler, ProtoGenerator } from './pieces/prototypes'
import { ProtoBuildQueue, ProtoHangar, ProtoDeviceMod } from  './components/prototypes'
import { ProtoOrder } from './objectives/prototypes'
//import { ProtoBattlefield } from './objectives/Battlefield'

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
      hangars: data.hangars,
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
    case 'setdemand':
      setDemand(e.data.body)
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
      if (buildQ.progress >= 100) {
        const item = buildQ.items.shift()
        if (item) {
          if (item.isUnit) {
            const hangarId = data.factories[item.ownerId].hangarId
            const hangar = data.hangars[hangarId]
            !hangar.units[item.type] && (hangar.units[item.type] = [])
            hangar.units[item.type].push(item)
          } else {
            Lazy(item.output).each((amt, name) => data.resources[name] += amt)
          }
        }
        buildQ.progress = 0
      }
      buildQ.progress += buildQ.buildRate
    })
}

const dispatch = ({ hangarId }) => {
  const hangar = data.hangars[hangarId]
  data.orders[hangar.ownerId] = Lazy(data.orders[hangar.ownerId].units)
    .merge(hangar.units)
    .toObject()
  hangar.units = { tanks: [] }
}

const setDemand = ({ hangarId, unitType, amt }) => {
  const hangar = data.hangars[hangarId]
  const nextAmt = amt < 0 ? 0 : amt
  const prevAmt = hangar.demand[unitType]
  hangar.demand[unitType] = nextAmt
  if (hangar.units[unitType].length < nextAmt) {
    if (!data.unitQueues[unitType].includes(hangarId))
      data.unitQueues[unitType].push(hangarId)
  }
  if (prevAmt > 0 && nextAmt <= 0) {
    const queue = Lazy(data.unitQueues[unitType])
      .reject(h => h === hangarId)
      .toArray()
    data.unitQueues[unitType] = queue
  }
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
          const firstHangar = data.hangars[actualQueue.shift()]
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

const updateOrders = () => Lazy(data.orders)
  .each(o => {
    if (o.want) {
      const totalUnitsLeft = Lazy(o.want)
        .reduce((acc, curr, currType) => {
          let unitsLeft = curr - (o.units[currType] ? o.units[currType].length : 0)
          unitsLeft = unitsLeft >= 0 ? unitsLeft : 0
          return acc + unitsLeft
        }, 0)
      if (totalUnitsLeft <= 0) {
        data.credits += 100
        o.order = null
        o.deadline = null
      }
    }
  })

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
  const order = new ProtoOrder({ tanks: 10 }, new Date(Date.now() + 20000))
  const hangar = makeHangar(order.id)
  order.hangarId = hangar.id
  data.orders[order.id] = order
  postMessage({ name: 'orders', body: { orders: data.orders, hangars: data.hangars } })
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

const togglePower = ({ buildingId }) => {
  const factory = data.factories[buldingId]
  factory.status = factory.status
  postMessage({
    name: 'buildings',
    body: { [factory.id]: factory }
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
