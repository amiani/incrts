import React, { Component } from 'react';

import Game from './game/game';
import GameStore from './game/gameContext';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <GameStore>
          <Game />
        </GameStore>
      </div>
    );
  }
}

export default App;
