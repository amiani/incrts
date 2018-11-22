import React from 'react'
import styled from 'styled-components'

import Apparatus from './Apparatus'
import Button from '../components/Button'
import Stack from '../components/Stack'
import ExpandingBuffer from '../components/Buffer/ExpandingBuffer'
import { ModPanelFront } from './mods/ModPanel'
import Switch from '../components/Switch'
import { ProtoAssembler } from './prototypes'
import broker from '../broker'
import { ProcedureSider } from '../components/procedures'

const HOVERDIST = 20;
const Box = styled.div`
  grid-row: 3;
  transform-origin: bottom;
  transition: transform ease 200ms;
  :hover {
    transform:
      translate3d(0, ${-HOVERDIST}px, 0)
      rotate3d(1, 0, 0, -5deg)
    ;
  }
`

export default class Assembler extends React.Component {
  state = { showSider: true }
  constructor(props) {
    super()
    this.id = props.assembler.id
  }
  
  enqueue = item => {
    broker.post({
      sub: 'enqueue',
      body: { 
        buildQueueId: this.props.assembler.buildQueueId, 
        item,
      }
    })
  }

  handlePowerChange = e => {
    broker.post({
      sub: 'togglepower',
      body: { apparatusId: this.id }
    })
  }

  toggleSider = () => this.setState({ showSider: !this.state.showSider })

  render() {
    const { stackId, bufferId, status, mods } = this.props.assembler
    return (
      <Box>
        <Apparatus
          width={ProtoAssembler.width}
          height={ProtoAssembler.height}
          showSider={this.toggleSider}
          front={
            <div>
              <Stack id={stackId} />
              <ModPanelFront mods={mods} />
            </div>
          }
          back={
            <Switch on={status} handleChange={this.handlePowerChange} />
          }
        />
      </Box>
    )
  }
}
