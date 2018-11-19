import React from 'react'
import styled from 'styled-components'

import broker from './broker'
import Button from './components/Button'
import MessageBox from './components/MessageBox'

const Box = styled.div`
  display: flex;
  position: relative;
  z-index: 10;
  flex-direction: column;
  padding: 5px;
  flex-shrink: 0;
  height: 100%;
  transform: translate3d(0,0,0);
`

const ResourceInfo = styled.p`
`

export default class LeftSider extends React.Component {
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
    broker.addListener(
      'update',
      { id: 'sidebar', onmessage: this.onmessage }
    )
  }

  onmessage = ({ resources }) => this.setState(resources)

  buyFabric = amt => {
    broker.post({
      sub: 'buy',
      body: { fabric: amt }
    })
  }

  render() {
    return (
      <Box>
        <div>
          <ResourceInfo>Credits: {this.state.credits.toFixed(0)}</ResourceInfo>
          <ResourceInfo>Energy: {this.state.energy.toFixed(1)}</ResourceInfo>
          <ResourceInfo>Fabric: {this.state.fabric.toFixed(0)}</ResourceInfo>
          <ResourceInfo>Hardware: {this.state.hardware.toFixed(0)}</ResourceInfo>
          <ResourceInfo>Devices: {this.state.devices}</ResourceInfo>
          <ResourceInfo>Drain: {this.state.drain}</ResourceInfo>
          <ResourceInfo>Productivity: {(this.state.productivity * 100).toFixed(0)}%</ResourceInfo>
        </div>
        <Button onClick={()=>this.buyFabric(10)}>Buy 10 Fabric</Button>
        <Button onClick={()=>broker.post({ sub: 'buildassembler' })}>Build Assembler</Button>
        <Button onClick={()=>broker.post({ sub: 'buildcrucible' })}>Build Crucible</Button>
        <Button onClick={()=>broker.post({ sub: 'buildgenerator' })}>Build Generator</Button>
        <Button onClick={()=>broker.post({ sub: 'buildport' })}>Build Port</Button>
      </Box>
    )
  }
}
