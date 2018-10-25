import React, { Component } from 'react'
import { createGlobalStyle } from 'styled-components'

import Main from './game/Main'

const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
    margin: 0;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }

  body {
    user-select: none;
    margin: 0;
  }
`

class App extends Component {
  render() {
    return (
      <div className="App">
        <Main />
        <GlobalStyle />
      </div>
    )
  }
}

export default App
