import React, { Component } from 'react';

import Game from './game/Game';
import GameStore, { GameContext } from './game/gameContext';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <GameStore>
          <GameContext.Consumer>
            {gameState => <Game gameState={gameState} />}
          </GameContext.Consumer>
        </GameStore>
      </div>
    );
  }
}

export default App;
