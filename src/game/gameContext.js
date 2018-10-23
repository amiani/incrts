import React from 'react'
import Lazy from 'lazy.js'

import { ProtoFactory } from './pieces/prototypes'
import { ProtoAssembler } from './pieces/prototypes'
import { ProtoGenerator } from './pieces/prototypes'
import { ProtoBuildQueue } from  './components/prototypes'
import { ProtoHangar } from './components/prototypes'
import { ProtoBattlefield } from './objectives/Battlefield'
import Order from './objectives/Order'

const FABRICPRICE = 10

const GameContext = React.createContext()
export default GameContext


export class GameStore extends React.Component {
  units = {}

  state = {
    //resources
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
    drain: 0,
    productivity: 1,

    //buildings
    factories: {},
    assemblers: {},
    generators: {},

    buildQueues: {},

    hangars: {},
    unitQueues: { tanks: [], },

    orders: {},

    addEnergy: amount => {
      this.setState((prevState, _) => ({ energy: prevState.energy + amount }))
    },

    //converted
    addCredits: amt => this.setState((prevState, _) => ({ credits: prevState.credits + amt })),

    //converted
    buyFabric: amt => new Promise((resolve, reject) => this.setState((prevState, _) => {
      if (this.canAfford({ credits: amt * FABRICPRICE }, prevState)) {
        return {
          credits: prevState.credits - amt * FABRICPRICE,
          fabric: prevState.fabric + amt
        }
      }
      reject('Insufficient Funds')
      return null
    }, resolve('success'))),

    //converted
    updateResources: () => this.setState((prevState, _) => {
      let energy = prevState.energy + prevState.energyIncome - prevState.drain
      energy = energy > 0 ? energy : 0
      const productivity = energy > prevState.drain || !prevState.drain
        ? 1
        : prevState.energyIncome / prevState.drain

      return ({
        credits: prevState.credits + prevState.creditIncome,
        fabric: prevState.fabric + prevState.fabricIncome,
        energy,
        productivity,
      })
    }),

    //converted
    buildFactory: async () => {
      try {
        const factory = new ProtoFactory()
        const [hangarId, buildQId] = await Promise.all([
          this.makeHangar(factory.id, true),
          this.makeBuildQueue(factory.id),
        ])
        factory.hangarId = hangarId
        factory.buildQueueId = buildQId
        await this.buildBuilding(factory)
      }
      catch(error) {
        console.log(error)
      }
    },
    //converted
    buildAssembler: async () => {
      try {
        const assembler = new ProtoAssembler()
        const buildQId = await this.makeBuildQueue(assembler.id)
        assembler.buildQueueId = buildQId
        await this.buildBuilding(assembler)
      }
      catch(error) {
        console.log(error)
      }
    },
    //converted
    buildGenerator: async () => {
      try { await this.buildBuilding(new ProtoGenerator()) }
      catch(error) {
        console.log(error)
      }
    },

    addProgress: (buildQId, amount) => new Promise((resolve, reject) => {
      if (this.state.buildQueues[buildQId].items.length > 0) {
        this.setState((prevState, _) => {
          let nextState = {
            buildQueues: this.copyBuildQueues(prevState.buildQueues)
          }
          const actual = nextState.buildQueues[buildQId]
          if (actual.progress >= 100) {
            this.addOutput(prevState, nextState, actual.items[0].output)
            this.completeBuild(actual)
          } else {
            actual.progress += amount
          }
          return nextState
        }, resolve('success'))
      }
      reject('nothing queued')
    }),

    //converted
    //TODO: find way of using prevState for prevActual
    enqueue: (buildQId, item) => new Promise(async (resolve, reject) => {
      const prevActual = this.state.buildQueues[buildQId]
      if (prevActual.items.length >= prevActual.maxLength) {
        return reject('queue full')
      }
      if (item.cost) {
        try { await this.spend(item.cost) }
        catch(error) {
          return reject(error)
        }
      }

      this.setState((prevState, _) => {
        const buildQueues = this.copyBuildQueues(prevState.buildQueues)
        buildQueues[buildQId].items.push(item)
        return { buildQueues }
      }, resolve('success'))
    }),

    //converted
    toggleQueueLoop: buildQId => this.setState((prevState, _) => {
      const buildQueues = this.copyBuildQueues(prevState.buildQueues)
      buildQueues[buildQId].loop = !buildQueues[buildQId].loop
      return { buildQueues }
    }),
        
    //converted
    getBuildingsDrain: () => {
      const factoryDrain = this.reducePieceDrain(this.state.factories)
      const assemblerDrain = this.reducePieceDrain(this.state.assemblers)
      return factoryDrain + assemblerDrain
    },

    //converted
    updateBuildings: () => {
      const drain = this.state.getBuildingsDrain()

      const energyIncome = Lazy(this.state.generators)
        .pluck('output')
        .reduce((acc, curr) => acc + curr, 0)

      this.setState((prevState, _) => ({ drain, energyIncome }))
    },

    //converted
    updateBuildQueues: () => this.setState((prevState, _) => {
      const nextState = {}
      nextState.buildQueues = Lazy(prevState.buildQueues)
        .map((buildQueue, buildQId) => {
          const nextBuildQueue = {
            ...buildQueue,
            items: [...buildQueue.items]
          }
          if (nextBuildQueue.progress >= 100) {
            this.mutateWithResult(prevState, nextState, nextBuildQueue.items[0])
            this.completeBuild(nextBuildQueue)
          }
          return [buildQId, nextBuildQueue]
        })
        .toObject()
      return nextState
    }),

    //converted
    makeOrder: async () => {
      try {
        const order = new Order(this.state)
        const hangarId = await this.makeHangar(order.id)
        order.hangarId = hangarId
        this.addOrder(order)
      }
      catch(error) {
        console.log(error)
      }
    },

    makeBattlefield: () => new Promise((resolve, reject) => {
      this.setState((prevState, _) => {
        const nextState = {
          battlefields: { ...prevState.battlefields },
          hangars: { ...prevState.hangars },
        }
        const BF = new ProtoBattlefield()
        const hangar = new ProtoHangar(BF.id, false)
        BF.hangarId = hangar.id
        nextState.battlefields[BF.id] = BF
        nextState.hangars[hangar.id] = hangar
        return nextState
      }, resolve('success'))
    }),

    //converted
    dispatch: hangarId => this.setState((prevState, _) => {
      const hangars = this.copyHangars(prevState.hangars)
      const orders = this.copyOrders(prevState.orders)
      const hangar = hangars[hangarId]
      orders[hangar.ownerId].dispatch(hangar.units)
      this.units = Lazy(this.units)
        .merge(hangar.units)
        .toObject()
      hangar.units = { tanks: [] }
      return { orders, hangars }
    }),

    //converted
    //TODO: See if possible to delay iteration until end
    updateHangars: () => {
      this.setState((prevState, _) => {
        const hangars = this.copyHangars(prevState.hangars)
        const unitQueues = this.copyUnitQueues(prevState.unitQueues)

        Lazy(hangars)
          .where({ isSource: true })
          .pluck('units')
          .each(units => {
            Lazy(units)
              .each((unitArr, unitType) => {
                if (Lazy(unitArr).isEmpty())
                  return
                const actualQueue = unitQueues[unitType]
                if (actualQueue.length > 0) {
                  const unit = unitArr.shift()
                  const firstHangar = prevState.hangars[actualQueue.shift()]
                  unit.ownerId = firstHangar.ownerId
                  !firstHangar.units[unitType] && (firstHangar.units[unitType] = [])
                  firstHangar.units[unitType].push(unit)
                  if (firstHangar.units[unitType].length < firstHangar.demand[unitType]) {
                    actualQueue.push(firstHangar.id)
                  }
                }
              })
          })
        return { hangars, unitQueues }
      })
    },

    updateOrders: () => Lazy(this.state.orders).each(o => o.update()),

    setDemand: (hangarId, unitType, amt) => this.setState((prevState, _) => {
      const hangars = this.copyHangars(prevState.hangars)
      const unitQueues = this.copyUnitQueues(prevState.unitQueues)
      const hangar = hangars[hangarId]
      const nextAmt = amt < 0 ? 0 : amt
      const prevAmt = hangar.demand[unitType]
      hangar.demand[unitType] = nextAmt
      if (hangar.units[unitType].length < nextAmt) {
        if (!unitQueues[unitType].includes(hangarId))
          unitQueues[unitType].push(hangarId)
      }
      if (prevAmt > 0 && nextAmt <= 0) {
        const queue = Lazy(unitQueues[unitType])
          .reject(h => h === hangarId)
          .toArray()
        unitQueues[unitType] = queue
      }
      return { hangars, unitQueues }
    }),

    //converted
    togglePower: buildingId => this.setState((prev, _) => {
      const factories = this.copyBuildings(prev.factories)
      factories[buildingId].status = !factories[buildingId].status
      return { factories }
    }),
  }


    //converted
  canAfford = (cost, state) => Lazy(cost)
    .keys()
    .reduce((acc, curr) => acc && state[curr] >= cost[curr], true)

    //converted
  spend = cost => new Promise((resolve, reject) => {
    if (this.canAfford(cost, this.state)) {
      const resources = {}
      this.setState((prevState, _) => {
        Lazy(cost)
          .keys()
          .each(rsrc => { resources[rsrc] = prevState[rsrc] - cost[rsrc] })
        return resources
      }, resolve('success'))
    }
    reject('insufficient resources')
  })

    //converted
  //TODO: find better way of doing this
  mutateWithResult = (prevState, nextState, item) => {
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

    //converted
  buildBuilding = data => new Promise(async (resolve, reject) => {
    try {
      await this.spend(data.cost)
      this.setState((prevState, _) => ({
        [data.type]: { ...prevState[data.type], [data.id]: data }
      }), resolve(`Built ${data.name}`))
    }
    catch(error) {
      reject(error)
    }
  })

    //converted
  makeBuildQueue = ownerId => new Promise((resolve, reject) => {
    const newQ = new ProtoBuildQueue(ownerId)
    this.setState((prevState, _) => {
      const buildQueues = this.copyBuildQueues(prevState.buildQueues)
      buildQueues[newQ.id] = newQ
      return { buildQueues }
    }, resolve(newQ.id))
  })

    //converted
  makeHangar = (ownerId, isSource) => new Promise((resolve, reject) => {
    const newHangar = new ProtoHangar(ownerId, isSource)
    this.setState((prevState, _) => {
      const hangars = Lazy(prevState.hangars)
        .map((hangar, hangarId) => ([
          hangarId,
          {
            ...hangar,
            demand: { ...hangar.demand },
          }
        ]))
        .toObject()
      hangars[newHangar.id] = newHangar
      return { hangars }
    }, resolve(newHangar.id))
  })

  //converted
  addOrder = order => this.setState((prevState, _) => {
      const orders = prevState.orders
      orders[order.id] = order
      return { orders }
  })

  copyBuildings = buildings => Lazy(buildings)
    .map((building, buildingId) => ([
      buildingId,
      { ...building }
    ]))
    .toObject()

  copyOrders = orders => Lazy(orders)
    .map((order, orderId) => ([
      orderId,
      { ...order }
    ]))
    .toObject()

  copyBuildQueues = buildQueues => Lazy(buildQueues)
    .map((buildQueue, buildingId) => ([
      buildingId,
      {
        ...buildQueue,
        items: [...buildQueue.items],
      }
    ]))
    .toObject()

  copyHangars = hangars => Lazy(hangars)
    .map((hangar, ownerId) => ([
      ownerId,
      {
        ...hangar,
        demand: { ...hangar.demand }
      }
    ]))
    .toObject()

  copyUnitQueues = unitQueues => Lazy(unitQueues)
    .map((unitQueue, unitType) => ([unitType, [...unitQueue]]))
    .toObject()

    //converted
  completeBuild = buildQueue => {
    buildQueue.progress = 0
    buildQueue.items.shift()
  }

  //converted
  reducePieceDrain = pieces => Lazy(pieces)
    .pluck('drain')
    .reduce((acc, curr) => acc + curr, 0)

  render() {
    return (
      <GameContext.Provider value={this.state}>
        {this.props.children}
      </GameContext.Provider>
    )
  }
}
