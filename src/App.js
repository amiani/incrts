import React, { Component } from 'react';
import { createGlobalStyle } from 'styled-components';

import Game from './game/Game';
import GameStore, { GameContext } from './game/gameContext';
import './App.css';

const GlobalStyle = createGlobalStyle`
  body {
    user-select: none;
  }
`;

class App extends Component {
  render() {
    return (
      <div className="App">
        <GameStore>
          <GameContext.Consumer>
            {store => <Game store={store} />}
          </GameContext.Consumer>
          <GlobalStyle />
        </GameStore>
      </div>
    );
  }
}

export default App;
