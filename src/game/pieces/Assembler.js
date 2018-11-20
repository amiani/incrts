import React from 'react'
import styled from 'styled-components'

import Building from './Building'
import Button from '../components/Button'
import BuildQueue from '../components/BuildQueue'
import ExpandingBuffer from '../components/Buffer/ExpandingBuffer'
import { ModPanelFront } from './mods/ModPanel'
import Switch from '../components/Switch'
import { ProtoAssembler } from './prototypes'
import broker from '../broker'
import { RecipeSider } from '../components/recipes'

const Box = styled.div`
  display: flex;
  justify-content: space-evenly;
  grid-row: 3;
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
      body: { buildingId: this.id }
    })
  }

  toggleSider = () => this.setState({ showSider: !this.state.showSider })

  render() {
    const { buildQueueId, bufferId, status, mods } = this.props.assembler
    return (
      <Box>
        <Building
          width={ProtoAssembler.width}
          height={ProtoAssembler.height}
          showSider={this.toggleSider}
          front={
            <div>
              <BuildQueue id={buildQueueId} />
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
