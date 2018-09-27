import React from 'react';

import Factory from './pieces/Factory'
import Assembler from './pieces/Assembler'

export const GameContext = React.createContext();

export default class GameStore extends React.Component {
  state = {
    resources: {
      credits: 100,
      creditsPerTick: 5,
      fabric: 0,
      fabricPerTick: 5,
      energy: 0,
      energyPerTick: 5,
      drain: 0,
      productivity: 1,

      update: () => this.setState((prevState, _) => {
        const prevRsrcs = prevState.resources;
        let energy = prevRsrcs.energy + prevRsrcs.energyPerTick - prevRsrcs.drain;
        energy = energy >= 0 ? energy : 0;
        return ({
          resources: {
            ...prevState.resources,
            credits: prevRsrcs.credits + prevRsrcs.creditsPerTick,
            fabric: prevRsrcs.fabric + prevRsrcs.fabricPerTick,
            energy,
            productivity: energy > prevRsrcs.drain ? 1 : prevRsrcs.energyPerTick / prevRsrcs.drain,
          }
        });
      }),
    },

    buildings:{
      plurals: {
        [Factory]: 'factories',
        [Assembler]: 'assemblers',
      },
      
      factories: [],
      assemblers: [],

      buildFactory: () => this.buildBuilding(Factory),
      buildAssembler: () => this.buildBuilding(Assembler),

      getBuildingsDrain: () => {
        const factoryDrain = this.sumPieceArrDrain(this.state.buildings.factories);
        const assemblerDrain = this.sumPieceArrDrain(this.state.buildings.assemblers);
        return factoryDrain + assemblerDrain;
      },

      update: () => {
        let drain = this.state.buildings.factories.reduce((acc, curr) => acc + curr.update(), 0)
        drain += this.state.buildings.assemblers.reduce((acc, curr) => acc + curr.update(), 0)
        this.setState((prevState, _) => ({ resources: { ...prevState.resources, drain } }));
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
