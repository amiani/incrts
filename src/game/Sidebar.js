import React from 'react'
import styled from 'styled-components'

import GameContext from './gameContext'
import Button from './components/Button'
import MessageBox from './components/MessageBox'
import { OBSERVEDBITS } from './constants'

const Box = styled.div`
  display: flex;
  flex-direction: column;
`

const ResourceInfo = styled.p`
`

export default class Sidebar extends React.Component {
  state = { message: '' }

  shouldComponentUpdate() {
    return false
  }

  render() {
    return (
      <GameContext.Consumer
        unstable_observedBits={OBSERVEDBITS.resources}
      >{store => (
        <Box>
          <div>
            <ResourceInfo>Credits: {store.credits.toFixed(0)}</ResourceInfo>
            <ResourceInfo>Energy: {store.energy.toFixed(1)}</ResourceInfo>
            <ResourceInfo>Fabric: {store.fabric.toFixed(0)}</ResourceInfo>
            <ResourceInfo>Hardware: {store.hardware.toFixed(0)}</ResourceInfo>
            <ResourceInfo>Drain: {store.getBuildingsDrain()}</ResourceInfo>
            <ResourceInfo>Productivity: {(store.productivity * 100).toFixed(0)}%</ResourceInfo>
          </div>
          <Button onClick={()=>store.buyFabric(10).catch(e=>this.setState({ message: e }))}>Buy 10 Fabric</Button>
          <Button onClick={store.buildFactory}>Build Factory</Button>
          <Button onClick={store.buildAssembler}>Build Assembler</Button>
          <Button onClick={store.buildGenerator}>Build Generator</Button>
          <MessageBox message={this.state.message} />
        </Box>
      )}</GameContext.Consumer>
    )
  }
}
