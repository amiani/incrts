import React from 'react'
import uuidv4 fom 'uuid/v4'
import styled from 'styled-components'

export function ProtoDeviceMod() {
  this.id = uuidv4()
  this.type = 'mods'
  this.name = 'Device Mod'
  this.cost = { fabric: 50 }
  this.drain = 0
  this.status = true
}

export default class DeviceMod extends React.Component {
  render() {
    return (
    )
  }
}
