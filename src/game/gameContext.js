import React from 'react';

import Factory from './pieces/Factory'
import Assembler from './pieces/Assembler'
import Generator from './pieces/Generator'

export const GameContext = React.createContext();

export default class GameStore extends React.Component {
  state = {
    resources: {
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

      addEnergy: amount => this.setState((prevState, _) => ({
        resources: { ...prevState.resources, energy: prevState.resources.energy + amount }
      })),

      update: () => this.setState((prevState, _) => {
        const prevRsrcs = prevState.resources;
        let energy = prevRsrcs.energy + prevRsrcs.energyIncome - prevRsrcs.drain;
        energy = energy > 0 ? energy : 0;
        const productivity = energy > prevRsrcs.drain || !prevRsrcs.drain
          ? 1
          : prevRsrcs.energyIncome / prevRsrcs.drain;

        return ({
          resources: {
            ...prevState.resources,
            credits: prevRsrcs.credits + prevRsrcs.creditIncome,
            fabric: prevRsrcs.fabric + prevRsrcs.fabricIncome,
            energy,
            productivity,
          }
        });
      }),
    },

    buildings:{
      plurals: {
        [Factory]: 'factories',
        [Assembler]: 'assemblers',
        [Generator]: 'generators',
      },
      
      factories: [],
      assemblers: [],
      generators: [new Generator()],

      buildFactory: () => this.buildBuilding(Factory),
      buildAssembler: () => this.buildBuilding(Assembler),
      buildGenerator: () => this.buildBuilding(Generator),

      getBuildingsDrain: () => {
        const factoryDrain = this.sumPieceArrDrain(this.state.buildings.factories);
        const assemblerDrain = this.sumPieceArrDrain(this.state.buildings.assemblers);
        return factoryDrain + assemblerDrain;
      },

      update: () => {
        //let drain = this.state.buildings.factories.reduce((acc, curr) => acc + curr.update(), 0);
        //drain += this.state.buildings.assemblers.reduce((acc, curr) => acc + curr.update(), 0);
        const drain = this.state.buildings.getBuildingsDrain();

        const energyIncome = this.state.buildings.generators.reduce((acc, curr) => acc + curr.update(), 0);

        this.setState((prevState, _) => ({
          resources: {
            ...prevState.resources,
            drain,
            energyIncome,
          }
        }));
      },
    },

    units: {
    },

    battlefield: {
    },
  }

  canAfford = cost => Object.keys(cost).reduce((acc, curr) => acc && this.state.resources[curr] > cost[curr], true)

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

  buildBuilding = async buildingType => {
    try {
      await this.spend(buildingType.defaultCost());
      this.setState((prevState, _) => {
        const pluralType = this.state.buildings.plurals[buildingType];
        return {
          buildings: {
            ...prevState.buildings,
            [pluralType]: prevState.buildings[pluralType].concat(new buildingType())
          }
        };
      });
    }
    catch(error) {
      console.log(error);
    }
  }

  sumPieceArrDrain = pieces => pieces.reduce((acc, curr) => acc + curr.drain, 0)

  render() {
    return (
      <GameContext.Provider value={this.state}>
        {this.props.children}
      </GameContext.Provider>
    );
  }
}
