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

      update: () => this.setState((prevState, _) => ({
        resources: {
          ...prevState.resources,
          credits: prevState.resources.credits + prevState.resources.creditsPerTick,
          fabric: prevState.resources.fabric + prevState.resources.fabricPerTick,
          energy: prevState.resources.energy + prevState.resources.energyPerTick,
        }
      })),
    },

    buildings:{
      plurals: {
        [Factory]: 'factories',
        [Assembler]: 'assemblers',
      },
      
      factories: [],
      assemblers: [],

      buildFactory: () => this.buildBuilding(Factory, { credits: 100 }),
      buildAssembler: () => this.buildBuilding(Assembler, { credits: 50, fabric: 10 }),
    },

    units: {
    },

    battlefield: {
    },

    addTrust: () => this.setState((prevState, _) => ({
      resources: {
        ...prevState.resources,
        credits: prevState.resources.credits + 10
      }
    }))
  }

  canAfford = cost => Object.keys(cost).reduce((acc, curr) => acc && this.state.resources[curr] > cost[curr], true)

  spend = cost => new Promise((resolve, reject) => {
    if (this.canAfford(cost)) {
      this.setState((prevState, _) => {
        const resources = { ...prevState.resources };
        Object.keys(cost).forEach(resource => { resources[resource] = resources[resource] - cost[resource]; });
        return { resources };
      }, resolve('success'));
    }
    reject('insufficient resources');
  })

  buildBuilding = async (type, cost) => {
    try {
      await this.spend(cost);
      this.setState((prevState, _) => {
        const pluralType = this.state.buildings.plurals[type];
        return {
          buildings: {
            ...prevState.buildings,
            [pluralType]: prevState.buildings[pluralType].concat(new type())
          }
        };
      });
    }
    catch(error) {
      console.log(error);
    }
  }

  render() {
    return (
      <GameContext.Provider value={this.state}>
        {this.props.children}
      </GameContext.Provider>
    );
  }
}
