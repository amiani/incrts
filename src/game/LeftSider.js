import React from 'react'
import styled from 'styled-components'

import ProcedureMenu from './components/procedures/ProcedureMenu'
import Knob from './components/Knob'
import broker from './broker'
import Button from './components/Button'

const Box = styled.div`
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  padding: 5px;
  flex-shrink: 0;
  height: 100%;
  background-color: #002836;
  box-shadow: 3px 0px 5px 0px #000;
`

const ResourceInfo = styled.p`
  margin-top: 10px;
`

export default class LeftSider extends React.Component {
  state = {
    credits: 3200,
    creditIncome: 0,
    fabric: 3200,
    hardware: 1000,
    hardwareIncome: 0,
    devices: 0,
    synthetics: 0,
    energy: 10000,
    energyIncome: 0,
    drain: 0,
    productivity: 1,
    fabricRate: 0,
    maxFabricRate: 2,
    procedures: {},
  }

  constructor() {
    super()
    broker.addListener('update', 'sidebar', this.onUpdate)
    broker.addListener('procedures', 'sidebar', this.onProcedures)
  }

  onUpdate = ({ resources }) => this.setState(resources)
  onProcedures = procedures => this.setState({ procedures })

  buyFabric = amt => {
    broker.post({
      sub: 'buy',
      body: { fabric: amt }
    })
  }

  fabricRateChange = amt => {
    broker.post({
      sub: 'setFabricRate',
      body: { rate: this.state.fabricRate + amt }
    })
  }

  render() {
    return (
      <Box>
        <div>
          <ResourceInfo>Credits: {this.state.credits.toFixed(0)}</ResourceInfo>
          <Knob
            size={120}
            value={this.state.fabricRate}
            handleChange={this.fabricRateChange}
            min={0}
            max={this.state.maxFabricRate}
            step={1}
            units='f/10s'
          />
          <ResourceInfo>Fabric: {this.state.fabric.toFixed(0)}</ResourceInfo>
          <ResourceInfo>Energy: {this.state.energy.toFixed(1)}</ResourceInfo>
          <ResourceInfo>Hardware: {this.state.hardware.toFixed(0)}</ResourceInfo>
          <ResourceInfo>Devices: {this.state.devices}</ResourceInfo>
          <ResourceInfo>Drain: {this.state.drain}</ResourceInfo>
          <ResourceInfo>Productivity: {(this.state.productivity * 100).toFixed(0)}%</ResourceInfo>
        </div>
        <Button onClick={()=>broker.post({ sub: 'buildAssembler' })}>Build Assembler</Button>
        <Button onClick={()=>broker.post({ sub: 'buildPreaccelerator' })}>Build Preaccelerator</Button>
        <ProcedureMenu procedures={this.state.procedures} />
      </Box>
    )
  }
}
