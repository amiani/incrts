import React from 'react';
import uuidv4 from 'uuid/v4';
import Lazy from 'lazy.js';

import { factoryData } from './pieces/Factory';
import { assemblerData } from './pieces/Assembler';
import { generatorData } from './pieces/Generator';
import { hangarData } from './pieces/components/Hangar';
import { battlefieldData } from './Battlefield';
import { portData } from './Port';

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
    ports: {},

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
        const id = uuidv4();
        await Promise.all([
          this.buildBuilding({ ...factoryData, id }),
          this.makeHangar(id, true),
          this.makeBuildQueue(id),
        ])
      }
      catch(error) {
        console.log(error);
      }
    },
    buildAssembler: async () => {
      try {
        const id = uuidv4();
        await Promise.all([
          this.buildBuilding({ ...assemblerData, id }),
          this.makeBuildQueue(id),
        ]);
      }
      catch(error) {
        console.log(error);
      }
    },
    buildGenerator: async () => {
      try { await this.buildBuilding({ ...generatorData, id: uuidv4() }); }
      catch(error) {
        console.log(error);
      }
    },

    addProgress: (id, amount) => new Promise((resolve, reject) => {
      if (this.state.buildQueues[id].items.length > 0) {
        this.setState((prevState, _) => {
          let nextState = {
            buildQueues: this.copyBuildQueues(prevState.buildQueues)
          };
          const actual = nextState.buildQueues[id];
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
    enqueue: (id, item) => new Promise(async (resolve, reject) => {
      const prevActual = this.state.buildQueues[id];
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
        buildQueues[id].items.push(item);
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
        .map((buildQueue, buildingId) => {
          const nextBuildQueue = {
            ...buildQueue,
            items: [...buildQueue.items]
          };
          if (nextBuildQueue.progress >= 100) {
            this.mutateWithResult(prevState, nextState, nextBuildQueue.items[0])
            this.completeBuild(nextBuildQueue);
          }
          return [buildingId, nextBuildQueue];
        })
        .toObject();
      return nextState;
    }),

    makeBattlefield: () => new Promise((resolve, reject) => {
      this.setState((prevState, _) => {
        const nextState = {
          battlefields: { ...prevState.battlefields },
          ports: { ...prevState.ports },
          hangars: { ...prevState.hangars },
        };
        const bf = new battlefieldData();
        nextState.battlefields[bf.id] = bf;
        nextState.ports[bf.id] = new portData();
        nextState.hangars[bf.id] = new hangarData(bf.id, false);
        nextState.hangars[bf.id].demand = { tanks: 3 }; //testing
        return nextState;
      }, resolve('success'));
    }),

    updateHangars: () => {
      this.setState((prevState, _) => {
        const hangars = this.copyHangars(prevState.hangars);
        const unitQueues = Lazy(prevState.unitQueues)
          .map((queue, type) => ([type, queue.map(h => hangars[h.buildingId])]))
          .toObject();

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
                  !firstHangar.units[unitType] && (firstHangar.units[unitType] = []);
                  firstHangar.units[unitType].push(unit);
                  if (firstHangar.units[unitType].length <= firstHangar.demand[unitType]) {
                    actualQueue.push(firstHangar);
                  }
                }
              });
          });
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
        return { hangars, unitQueues };
      });
    },
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
      const hangar = nextState.hangars[item.ownerId];
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

  makeBuildQueue = buildingId => new Promise((resolve, reject) => {
    this.setState((prevState, _) => {
      const buildQueues = this.copyBuildQueues(prevState.buildQueues);
      buildQueues[buildingId] = {
        id: uuidv4(),
        buildingId,
        progress: 0,
        maxLength: 2,
        items: [],
      };
      return { buildQueues };
    }, resolve(`made BuildQueue for ${buildingId}`));
  })

  copyBuildQueues = buildQueues => {
    return Lazy(buildQueues)
      .map((buildQueue, buildingId) => ([
        buildingId,
        {
          ...buildQueue,
          items: [...buildQueue.items],
        }
      ]))
      .toObject();
  }

  copyHangars = hangars => Lazy(hangars)
    .map((hangar, buildingId) => ([
      buildingId,
      {
        ...hangar,
        demand: { ...hangar.demand }
      }
    ]))
    .toObject()

  completeBuild = buildQueue => {
    buildQueue.progress = 0;
    buildQueue.items.shift();
  }

  makeHangar = (buildingId, isSource) => new Promise((resolve, reject) => {
    this.setState((prevState, _) => {
      const hangars = Lazy(prevState.hangars)
        .map((hangar, buildingId) => ([
          buildingId,
          {
            ...hangar,
            demand: { ...hangar.demand },
          }
        ]))
        .toObject();
      hangars[buildingId] = new hangarData(buildingId, isSource);
      return { hangars };
    }, resolve(`made hangar for ${buildingId}`));
  })

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
