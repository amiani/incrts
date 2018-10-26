import React from 'react'
import styled from 'styled-components'

import Building from './Building'
import Button from '../components/Button'
import BuildQueue from '../components/BuildQueue'
import ExpandingHangar from '../components/Hangar/ExpandingHangar'
import { ModPanelFront } from './mods/ModPanel'
import Switch from '../components/Switch'
import { ProtoFactory } from './prototypes'
import broker from '../broker'
import { RecipeSider } from '../components/recipes'

const Box = styled.div`
  display: flex;
  justify-content: space-evenly;
`

export default class Factory extends React.Component {
  state = { showSider: true }
  constructor(props) {
    super()
    this.id = props.factory.id
  }
  
  enqueue = item => {
    broker.post({
      sub: 'enqueue',
      body: { 
        buildQueueId: this.props.factory.buildQueueId, 
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
    const { buildQueueId, hangarId, status, mods } = this.props.factory
    return (
      <Box>
        <Building
          width={ProtoFactory.width}
          height={ProtoFactory.height}
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
        {this.state.showSider ? (
          <RecipeSider
            height={ProtoFactory.height}
            recipes={this.props.factory.recipes}
            enqueue={this.enqueue}
          />
        ) : null}
        <ExpandingHangar
          id={hangarId}
          height={ProtoFactory.height}
          width={50}
        />
      </Box>
    )
  }
}
