import React, { Component } from 'react'
import { createGlobalStyle } from 'styled-components'

import Game from './game/Game'
import GameContext, { GameStore } from './game/gameContext'
import './App.css'

const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }

  body {
    user-select: none;
  }
`

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
    )
  }
}

export default App
