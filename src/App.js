import React, { Component } from 'react'
import { createGlobalStyle } from 'styled-components'

import Main from './game/Main'

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
        <Main />}
        <GlobalStyle />
      </div>
    )
  }
}

export default App
