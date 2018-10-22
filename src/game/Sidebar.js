import React from 'react'
import styled from 'styled-components'

import GameContext from './gameContext'
import game from './game'
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
  state = {
    credits: 3200,
    creditIncome: 0,
    fabric: 3200,
    fabricIncome: 0,
    hardware: 1000,
    hardwareIncome: 0,
    devices: 0,
    synthetics: 0,
    energy: 10000,
    energyIncome: 0,
    drain: 0,
    productivity: 1,
  }

  constructor() {
    super()
    game.addListener(
      'update',
      { id: 'sidebar', onmessage: a=>this.setState(a) }
    )
  }

  render() {
    return (
        <Box>
          <div>
            <ResourceInfo>Credits: {this.state.credits.toFixed(0)}</ResourceInfo>
            <ResourceInfo>Energy: {this.state.energy.toFixed(1)}</ResourceInfo>
            <ResourceInfo>Fabric: {this.state.fabric.toFixed(0)}</ResourceInfo>
            <ResourceInfo>Hardware: {this.state.hardware.toFixed(0)}</ResourceInfo>
            <ResourceInfo>Drain: {this.state.drain}</ResourceInfo>
            <ResourceInfo>Productivity: {(this.state.productivity * 100).toFixed(0)}%</ResourceInfo>
          </div>
          <Button onClick={()=>this.state.buyFabric(10).catch(e=>this.setState({ message: e }))}>Buy 10 Fabric</Button>
          <Button onClick={this.state.buildFactory}>Build Factory</Button>
          <Button onClick={this.state.buildAssembler}>Build Assembler</Button>
          <Button onClick={this.state.buildGenerator}>Build Generator</Button>
          <MessageBox message={this.state.message} />
        </Box>
    )
  }
}
