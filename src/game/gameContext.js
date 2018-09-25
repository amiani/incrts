import React from 'react';

export const GameContext = React.createContext();

export default class GameStore extends React.Component {
  state = {
    resources: {
      credits: 100,
      fabric: 0,
      energy: 0,
    },

    buildings:{
    },

    units: {
    },

    battlefield: {
    },

    addTrust: () => this.setState((prevState, _) => ({
      resources: {
        ...prevState.resources,
        credits: prevState.resources.credits += 10
      }
    }))
  }


  render() {
    return (
      <GameContext.Provider value={this.state}>
        {this.props.children}
      </GameContext.Provider>
    );
  }
}
