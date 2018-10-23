import React from 'react'
import styled from 'styled-components'
import Lazy from 'lazy.js'

import Sidebar from './Sidebar'
import Base from './Base'
import Port from './Port'
import Order from './objectives/Order'
import broker from './broker'

const GameGrid = styled.div`
  display: grid
  grid-template-columns: 1fr 4fr 2fr
  --pad: 5px
  padding: var(--pad)
  height: calc(100vh - 2*var(--pad))
  width: calc(100vw - 2*var(--pad))
`

export default class Main extends React.Component {
  state = { orders: {}, hangars: {} }
  constructor(props) {
    super(props)
    broker.addListener(
      'orders',
      { id: 'Main', onmessage: this.onmessage }
    )
    this.initialize()
  }

  initialize = () => {
    broker.post({ name: 'makeorder' })
    broker.post({ name: 'buildfactory' })
    broker.post({ name: 'buildassembler' })
    broker.post({ name: 'buildgenerator' })
  }

  onmessage = body => this.setState(body)

  render() {
    return (
      <GameGrid>
        <Sidebar />
        <Base />
        {Lazy(this.state.orders).map(o => (
          <div key={o.id}>
            <Order id={o.id} />
            <Port hangar={this.state.hangars[o.hangarId]} />
          </div>
        )).toArray()}
      </GameGrid>
    )
  }
}
