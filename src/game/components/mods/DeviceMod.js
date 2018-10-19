import React from 'react'
import uuidv4 fom 'uuid/v4'
import styled from 'styled-components'

export function ProtoDeviceMod() {
  this.id = uuidv4()
  this.type = 'mods'
  this.name = 'Device Mod'
  this.icon = 'devicemod.png'
  this.version = 1
  this.cost = { fabric: 50 }
  this.drain = 0
  this.status = true
  this.Control = DeviceModControl
}

export default class DeviceModControl extends React.Component {
  handlePowerChange = () => {
  }

  render() {
    return (
      <Box>
        <Switch on={this.props.mod.status} handleChange={this.handlePowerChange} />
      </Box>
    )
  }
}
