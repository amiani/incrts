import React from 'react';
import uuidv4 from 'uuid/v4';
import Lazy from 'lazy.js';

import { ProtoFactory } from './pieces/Factory';
import { ProtoAssembler } from './pieces/Assembler';
import { ProtoGenerator } from './pieces/Generator';
import { ProtoBuildQueue } from  './pieces/components/BuildQueue';
import { ProtoHangar } from './pieces/components/Hangar';
import { battlefieldData } from './Battlefield';

export const GameContext = React.createContext();

export default class GameStore extends React.Component {
  state = {
    //resources
    credits: 200,
    creditIncome: 0,
    fabric: 200,
    fabricIncome: 0,
    hardware: 50,
    hardwareIncome: 0,
    energy: 0,
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

    battlefields: {},

    units: {},

    addEnergy: amount => {
      this.setState((prevState, _) => ({ energy: prevState.energy + amount }));
    },

    updateResources: () => this.setState((prevState, _) => {
      let energy = prevState.energy + prevState.energyIncome - prevState.drain;
      energy = energy > 0 ? energy : 0;
      const productivity = energy > prevState.drain || !prevState.drain
        ? 1
        : prevState.energyIncome / prevState.drain;

      return ({
        credits: prevState.credits + prevState.creditIncome,
        fabric: prevState.fabric + prevState.fabricIncome,
        energy,
        productivity,
      });
    }),

    buildFactory: async () => {
      try {
        const factory = new ProtoFactory();
        const [hangarId, buildQId] = await Promise.all([
          this.makeHangar(factory.id, true),
          this.makeBuildQueue(factory.id),
        ])
        factory.hangarId = hangarId;
        factory.buildQueueId = buildQId;
        await this.buildBuilding(factory);
      }
      catch(error) {
        console.log(error);
      }
    },
    buildAssembler: async () => {
      try {
        const assembler = new ProtoAssembler();
        const buildQId = await this.makeBuildQueue(assembler.id);
        assembler.buildQueueId = buildQId;
        await this.buildBuilding(assembler);
      }
      catch(error) {
        console.log(error);
      }
    },
    buildGenerator: async () => {
      try { await this.buildBuilding(new ProtoGenerator()); }
      catch(error) {
        console.log(error);
      }
    },

    addProgress: (buildQId, amount) => new Promise((resolve, reject) => {
      if (this.state.buildQueues[buildQId].items.length > 0) {
        this.setState((prevState, _) => {
          let nextState = {
            buildQueues: this.copyBuildQueues(prevState.buildQueues)
          };
          const actual = nextState.buildQueues[buildQId];
          if (actual.progress >= 100) {
            this.addOutput(prevState, nextState, actual.items[0].output);
            this.completeBuild(actual);
          } else {
            actual.progress += amount;
          }
          return nextState;
        }, resolve('success'));
      }
      reject('nothing queued');
    }),

    //TODO: find way of using prevState for prevActual
    enqueue: (buildQId, item) => new Promise(async (resolve, reject) => {
      const prevActual = this.state.buildQueues[buildQId];
      if (prevActual.items.length >= prevActual.maxLength) {
        return reject('queue full');
      }
      if (item.cost) {
        try { await this.spend(item.cost); }
        catch(error) {
          return reject(error);
        }
      }

      this.setState((prevState, _) => {
        const buildQueues = this.copyBuildQueues(prevState.buildQueues);
        buildQueues[buildQId].items.push(item);
        return { buildQueues };
      }, resolve('success'));
    }),
        
    getBuildingsDrain: () => {
      const factoryDrain = this.reducePieceDrain(this.state.factories);
      const assemblerDrain = this.reducePieceDrain(this.state.assemblers);
      return factoryDrain + assemblerDrain;
    },

    updateBuildings: () => {
      const drain = this.state.getBuildingsDrain();

      const energyIncome = Lazy(this.state.generators)
        .pluck('output')
        .reduce((acc, curr) => acc + curr, 0);

      this.setState((prevState, _) => ({ drain, energyIncome }));
    },

    updateBuildQueues: () => this.setState((prevState, _) => {
      const nextState = {};
      nextState.buildQueues = Lazy(prevState.buildQueues)
        .map((buildQueue, buildQId) => {
          const nextBuildQueue = {
            ...buildQueue,
            items: [...buildQueue.items]
          };
          if (nextBuildQueue.progress >= 100) {
            this.mutateWithResult(prevState, nextState, nextBuildQueue.items[0])
            this.completeBuild(nextBuildQueue);
          }
          return [buildQId, nextBuildQueue];
        })
        .toObject();
      return nextState;
    }),

    makeBattlefield: () => new Promise((resolve, reject) => {
      this.setState((prevState, _) => {
        const nextState = {
          battlefields: { ...prevState.battlefields },
          hangars: { ...prevState.hangars },
        };
        const BF = new battlefieldData();
        const hangar = new ProtoHangar(BF.id, false);
        BF.hangarId = hangar.id;
        nextState.battlefields[BF.id] = BF;
        nextState.hangars[hangar.id] = hangar;
        return nextState;
      }, resolve('success'));
    }),

    /*
    dispatch: portId => this.setState((prevState, _) => {
      prevState.ports[portId].building
    }),
    */

    //TODO: See if possible to delay iteration until end
    updateHangars: () => {
      this.setState((prevState, _) => {
        const hangars = this.copyHangars(prevState.hangars);
        const unitQueues = this.copyUnitQueues(prevState.unitQueues);

        Lazy(hangars)
          .where({ isSource: true })
          .pluck('units')
          .each(units => {
            Lazy(units)
              .each((unitArr, unitType) => {
                if (Lazy(unitArr).isEmpty())
                  return;
                const actualQueue = unitQueues[unitType];
                if (actualQueue.length > 0) {
                  const unit = unitArr.shift();
                  const firstHangar = actualQueue.shift();
                  unit.ownerId = firstHangar.buildingId;
                  !firstHangar.units[unitType] && (firstHangar.units[unitType] = []);
                  firstHangar.units[unitType].push(unit);
                  if (firstHangar.units[unitType].length <= firstHangar.demand[unitType]) {
                    actualQueue.push(firstHangar);
                  }
                }
              });
          });
        /*
        Lazy(hangars)
          .where({ isSource: false })
          .each(hangar => {
            Lazy(hangar.demand)
              .each((amt, unitType) => {
                if (!hangar.units[unitType] || hangar.units[unitType].length <= amt) {
                  unitQueues[unitType].push(hangar);
                }
              });
          });
          */
        return { hangars, unitQueues };
      });
    },

    setDemand: (hangarId, unitType, amt) => this.setState((prevState, _) => {
      const hangars = this.copyHangars(prevState.hangars);
      const hangar = hangars[hangarId];
      const nextAmt = amt < 0 ? 0 : amt;
      const prevAmt = hangar.demand[unitType];
      hangar.demand[unitType] = nextAmt;
      if (prevAmt <= 0 && nextAmt > 0) {
        const unitQueues = this.copyUnitQueues(prevState.unitQueues);
        unitQueues[unitType].push(hangar);
        return { hangars, unitQueues };
      }
      if (prevAmt > 0 && nextAmt <= 0) {
        const unitQueues = this.copyUnitQueues(prevState.unitQueues);
        const queue = Lazy(unitQueues[unitType])
          .reject(h => h.id === hangarId)
          .toArray();
        unitQueues[unitType] = queue;
        return { hangars, unitQueues };
      }
      return { hangars };
    }),
  }


  canAfford = cost => Lazy(cost)
    .keys()
    .reduce((acc, curr) => acc && this.state[curr] >= cost[curr], true)

  spend = cost => new Promise((resolve, reject) => {
    if (this.canAfford(cost)) {
      const resources = {};
      this.setState((prevState, _) => {
        Lazy(cost)
          .keys()
          .each(rsrc => { resources[rsrc] = prevState[rsrc] - cost[rsrc]; });
        return resources;
      }, resolve('success'));
    }
    reject('insufficient resources');
  })

  //TODO: find better way of doing this
  mutateWithResult = (prevState, nextState, item) => {
    if (item.isUnit) {
      !nextState.hangars && (nextState.hangars = this.copyHangars(prevState.hangars));
      const hangarId = prevState.factories[item.ownerId].hangarId;
      const hangar = nextState.hangars[hangarId];
      !hangar.units[item.type] && (hangar.units[item.type] = []);
      hangar.units[item.type].push(item);
    } else {
      Lazy(item.output).each((amt, name) => {
        nextState[name] = (nextState[name] ? nextState[name] : prevState[name]) + amt;
      });
    }
  }

  buildBuilding = data => new Promise(async (resolve, reject) => {
    try {
      await this.spend(data.cost);
      this.setState((prevState, _) => ({
        [data.type]: { ...prevState[data.type], [data.id]: data }
      }), resolve(`Built ${data.name}`));
    }
    catch(error) {
      reject(error);
    }
  })

  makeBuildQueue = ownerId => new Promise((resolve, reject) => {
    const newQ = new ProtoBuildQueue(ownerId);
    this.setState((prevState, _) => {
      const buildQueues = this.copyBuildQueues(prevState.buildQueues);
      buildQueues[newQ.id] = newQ;
      return { buildQueues };
    }, resolve(newQ.id));
  })

  makeHangar = (ownerId, isSource) => new Promise((resolve, reject) => {
    const newHangar = new ProtoHangar(ownerId, isSource);
    this.setState((prevState, _) => {
      const hangars = Lazy(prevState.hangars)
        .map((hangar, hangarId) => ([
          hangarId,
          {
            ...hangar,
            demand: { ...hangar.demand },
          }
        ]))
        .toObject();
      hangars[newHangar.id] = newHangar;
      return { hangars };
    }, resolve(newHangar.id));
  })

  copyBuildings = buildings => Lazy(buildings)
    .map((building, buildingId) => ([
      buildingId,
      ...building
    ]))
    .toObject();

  copyBuildQueues = buildQueues => Lazy(buildQueues)
    .map((buildQueue, buildingId) => ([
      buildingId,
      {
        ...buildQueue,
        items: [...buildQueue.items],
      }
    ]))
    .toObject();

  copyHangars = hangars => Lazy(hangars)
    .map((hangar, buildingId) => ([
      buildingId,
      {
        ...hangar,
        demand: { ...hangar.demand }
      }
    ]))
    .toObject()

  copyUnitQueues = unitQueues => Lazy(unitQueues)
    .map((unitQueue, unitType) => ([unitType, [...unitQueue]]))
    .toObject();

  completeBuild = buildQueue => {
    buildQueue.progress = 0;
    buildQueue.items.shift();
  }

  reducePieceDrain = pieces => Lazy(pieces)
    .pluck('drain')
    .reduce((acc, curr) => acc + curr, 0)

  render() {
    return (
      <GameContext.Provider value={this.state}>
        {this.props.children}
      </GameContext.Provider>
    );
  }
}
