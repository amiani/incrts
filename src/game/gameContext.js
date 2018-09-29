import React from 'react';
import uuidv4 from 'uuid/v4';

import { factoryData } from './pieces/Factory';
import { assemblerData } from './pieces/Assembler';
import { generatorData } from './pieces/Generator';

export const GameContext = React.createContext();

export default class GameStore extends React.Component {
  state = {
    //resources
    credits: 100,
    creditIncome: 0,
    fabric: 100,
    fabricIncome: 0,
    hardware: 0,
    hardwareIncome: 0,
    energy: 0,
    energyIncome: 0,
    drain: 0,
    productivity: 1,

    //buildings
    factories: {},
    assemblers: {},
    generators: {},
    
    //buildQueues
    buildQueues: {},

    addEnergy: amount => this.setState((prevState, _) => ({ energy: prevState.energy + amount })),

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

    buildFactory: () => this.buildBuilding({ ...factoryData, id: uuidv4() }),
    buildAssembler: () => this.buildBuilding({ ...assemblerData, id: uuidv4() }),
    buildGenerator: async () => {
      try {
        await this.buildBuilding({ ...generatorData, id: uuidv4() });
        this.makeBuildQueue();
      }
      catch(error) {
        console.log(error);
      }
    },

    makeProgress: id => this.setState((prevState, _) => ({
      assemblers: prevState.assemblers,
    })),
        
    getBuildingsDrain: () => {
      const factoryDrain = this.sumPieceArrDrain(Object.values(this.state.factories));
      const assemblerDrain = this.sumPieceArrDrain(Object.values(this.state.assemblers));
      return factoryDrain + assemblerDrain;
    },

    updateBuildings: () => {
      //let drain = this.state.buildings.factories.reduce((acc, curr) => acc + curr.update(), 0);
      //drain += this.state.buildings.assemblers.reduce((acc, curr) => acc + curr.update(), 0);
      const drain = this.state.getBuildingsDrain();

      const energyIncome = Object.values(this.state.generators)
        .reduce((acc, curr) => acc + curr.output, 0);

      this.setState((prevState, _) => ({ drain, energyIncome }));
    },
  }

  canAfford = cost => Object.keys(cost).reduce((acc, curr) => acc && this.state[curr] >= cost[curr], true)

  spend = cost => new Promise((resolve, reject) => {
    if (this.canAfford(cost)) {
      this.setState((prevState, _) => {
        const resources = { ...prevState.resources };
        Object.keys(cost).forEach(rsrc => { resources[rsrc] = resources[rsrc] - cost[rsrc]; });
        return { resources };
      }, resolve('success'));
    }
    reject('insufficient resources');
  })

  buildBuilding = data => new Promise(async (resolve, reject) => {
    try {
      await this.spend(data.cost);
      this.setState((prevState, _) => ({
        [data.type]: { ...prevState[data.type], [data.id]: data }
      }), resolve(`Built ${data.name}`));
    }
    catch(error) {
      console.log(error);
      reject(error);
    }
  })

  makeBuildQueue = buildingId => new Promise((resolve, reject) => {
    resolve('hello');
  })

  sumPieceArrDrain = pieces => pieces.reduce((acc, curr) => acc + curr.drain, 0)

  render() {
    return (
      <GameContext.Provider value={this.state}>
        {this.props.children}
      </GameContext.Provider>
    );
  }
}
