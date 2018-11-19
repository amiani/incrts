import Lazy from 'lazy.js'
import uuidv4 from 'uuid/v4'

import { TICKRATE } from './constants'
import {
  ProtoAssembler,
  ProtoCrucible,
  ProtoGenerator,
  ProtoPort
} from './pieces/prototypes'
import { ProtoBuildQueue, ProtoHangar, ProtoDeviceMod } from  './components/prototypes'
import { ProtoOrder } from './objectives/prototypes'

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

  assemblers: {},
  crucibles: {},
  generators: {},
  mods: {},

  buildQueues: {},

  hangars: {},
  unitQueues: { tanks: [], },

  ports: {},
  orders: {},
}

let tick = 0
const update = () => {
  updateResources()
  updateBuildQueues()
  updateHangars()
  postMessage({
    sub: 'update',
    body: {
      resources: data.resources,
      buildQueues: data.buildQueues,
      hangars: data.hangars,
    }
  })
  tick % 10 == 0 && updateOrders()
  tick++
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
    case 'buildport':
      buildPort()
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
    default:
      console.log(`Received message with no listener: ${e.data.sub}`)
      break
  }
}

setInterval(update, TICKRATE)

const updateResources = () => {
  data.resources.energyIncome = Lazy(data.generators)
    .pluck('output')
    .sum()
  data.resources.drain = Lazy(data.assemblers)
    .merge(data.assemblers)
    .pluck('drain')
    .sum()
  let nextEnergy = data.resources.energy + data.resources.energyIncome - data.resources.drain
  data.resources.energy = nextEnergy > 0 ? nextEnergy : 0
  data.resources.productivity = data.resources.energy > data.resources.drain || !data.resources.drain
    ? 1
    : data.resources.energyIncome / data.resources.drain
}

const updateBuilding = building => {
  building.drain = building.baseDrain + building.mods.reduce((acc, m) => (
    acc + (m.drain ? m.drain : 0)
  ), 0)
  building.recipes = building.baseRecipes.concat(
    building.mods.reduce((acc, id) => acc.concat(data.mods[id].recipes), [])
  )
  postMessage({
    sub: 'building',
    body: building
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

const updateBuildQueues = () => {
  Lazy(data.buildQueues)
    .each(bq => {
      const item = bq.items[bq.currItem]
      if (item) {
        bq.progress += bq.buildRate * item.buildRate + 10
        if (bq.progress >= 100) {
          if (item.isUnit) {
            const unit = { ...item }
            unit.id = uuidv4()
            const hangarId = data.assemblers[unit.ownerId].hangarId
            const hangar = data.hangars[hangarId]
            !hangar.units[unit.type] && (hangar.units[unit.type] = [])
            hangar.units[unit.type].push(unit)
          } else {
            Lazy(item.output).each((amt, name) => data.resources[name] += amt)
          }
          bq.currItem++
          bq.currItem >= bq.items.length && (bq.currItem = 0)
          bq.progress = 0
        }
      }
    })
}

const dispatch = ({ hangarId, orderId }) => {
  const hangar = data.hangars[hangarId]
  const order = data.orders[orderId]
  Lazy(order.want)
    .each((numWanted, unitType) => {
      !order.units[unitType] && (order.units[unitType] = [])
      const orderUnits = order.units[unitType]
      const hangarUnits = hangar.units[unitType] || []
      const numNeeded = numWanted - (orderUnits ? orderUnits.length : 0)
      const numTaking = numNeeded > hangarUnits ? hangarUnits : numNeeded
      order.units[unitType] = orderUnits.concat(hangarUnits.splice(0, numTaking))
    })
  postMessage({
    sub: 'order',
    body: order
  })
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

const addMod = ({ buildingId, type, mod }) => {
  data.mods[mod.id] = mod
  const building = data[type][buildingId]
  building.mods.push(mod.id)
  postMessage({
    sub: 'controlMap',
    body: {
      id: mod.id,
      controlName: mod.controlName
    }
  })
  updateBuilding(building)
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
  const hangar = makeHangar(assembler.id, true)
  const buildQueue = makeBuildQueue(assembler.id)
  assembler.hangarId = hangar.id
  assembler.buildQueueId = buildQueue.id
  buildBuilding(assembler)
}

const buildCrucible = () => {
  const crucible = new ProtoCrucible()
  const buildQueue = makeBuildQueue(crucible.id)
  crucible.buildQueueId = buildQueue.id
  buildBuilding(crucible)
}

const buildGenerator = () => {
  buildBuilding(new ProtoGenerator())
}

const buildPort = () => {
  const port = new ProtoPort()
  const hangar = makeHangar(port.id, false)
  port.hangarId = hangar.id
  buildBuilding(port)
}

const buildBuilding = building => {
  spend(building.cost)
  data[building.type][building.id] = building
  postMessage({ sub: 'buildings', body: { [building.type]: data[building.type] } })
}

const makeHangar = (ownerId, isSource) => {
  const hangar = new ProtoHangar(ownerId, isSource)
  data.hangars[hangar.id] = hangar
  return hangar
}

const makeBuildQueue = ownerId => {
  const buildQueue = new ProtoBuildQueue(ownerId)
  data.buildQueues[buildQueue.id] = buildQueue
  return buildQueue
}

let orderNumber = 1
const makeOrder = () => {
  const order = new ProtoOrder(
    orderNumber,
    { tanks: 10 },
    new Date(Date.now() + 5000)
  )
  const hangar = makeHangar(order.id)
  order.hangarId = hangar.id
  data.orders[order.id] = order
  postMessage({ sub: 'orders', body: data.orders })
  orderNumber++
}

const cancelOrder = orderId => {
  delete data.orders[orderId]
  postMessage({ sub: 'orders', body: data.orders })
}

const enqueue = ({ buildQueueId, item }) => {
  const buildQueue = data.buildQueues[buildQueueId]
  if (buildQueue.items.length >= buildQueue.maxLength) {
    //respond with error
    return
  }
  if (item.cost) {
    spend(item.cost)
  }
  buildQueue.items.push(item)
}

const toggleLoop = ({ id }) => { data.buildQueues[id].loop = !data.buildQueues[id].loop }

const togglePower = ({ buildingId }) => {
  const assembler = data.assemblers[buildingId]
  assembler.status = !assembler.status
  postMessage({
    sub: 'building',
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
