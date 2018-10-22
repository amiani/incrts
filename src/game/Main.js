import React from 'react'
import styled from 'styled-components'
import Lazy from 'lazy.js'

import Sidebar from './Sidebar'
import Base from './Base'
import Port from './Port'

import { TICKRATE } from './constants'

const GameGrid = styled.div`
  display: grid
  grid-template-columns: 1fr 4fr 2fr
  --pad: 5px
  padding: var(--pad)
  height: calc(100vh - 2*var(--pad))
  width: calc(100vw - 2*var(--pad))
`

export default class Main extends React.Component {
  constructor(props) {
    super(props)
    this.initialize()
    setInterval(this.tickUpdate, TICKRATE)
  }

  initialize = () => {
    this.props.store.makeOrder()
    this.props.store.buildGenerator()
    this.props.store.buildFactory()
    this.props.store.buildAssembler()
  }

  tickUpdate = () => {
    this.props.store.updateResources()
    this.props.store.updateBuildings()
    this.props.store.updateBuildQueues()
    this.props.store.updateHangars()
    this.props.store.updateOrders()
  }

  render() {
    return (
      <GameGrid>
        <Sidebar />
        <Base />
        {Lazy(this.props.store.orders).map(obj => (
          <div key={obj.id}>
            <obj.Component
              {...obj.getProps()}
              store={this.props.store}
            />
            <Port
              hangar={this.props.store.hangars[obj.hangarId]}
              store={this.props.store}
            />
          </div>
        )).toArray()}
      </GameGrid>
    )
  }
}
