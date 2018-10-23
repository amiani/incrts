import React from 'react'
import styled from 'styled-components'

import Building from './Building'
import Button from '../components/Button'
import BuildQueue from '../components/BuildQueue'
import ExpandingHangar from '../components/Hangar/ExpandingHangar'
import { ProtoTank } from './units'
import { ModPanelFront } from '../components/mods/ModPanel'
import Switch from '../components/Switch'
import { ProtoFactory } from './prototypes'

const Box = styled.div`
  display: flex;
  justify-content: space-evenly;
`

export default class Factory extends React.Component {
  constructor(props) {
    super()
    this.id = props.factory.id
  }

  addProgress = () => {
    this.props.store.addProgress(
      this.props.factory.buildQueueId, 
      50*this.props.store.productivity
    )
      .catch(error => console.log(error))
  }

  enqueueTank = () => {
    this.props.store.enqueue(
      this.props.factory.buildQueueId,
      new ProtoTank(this.props.factory.id)
    )
      .catch(error => console.log(error))
  }

  handlePowerChange = e => {
    this.props.store.togglePower(this.id)
  }

  render() {
    const { buildQueueId, hangarId, status, mods } = this.props.factory
    return (
      <Box>
        <Building
          width={ProtoFactory.width}
          height={ProtoFactory.height}
          front={
            <div>
              <BuildQueue id={buildQueueId} />
              <Button onClick={this.addProgress}>Build</Button>
              <Button onClick={this.enqueueTank}>Tank</Button>
              <ModPanelFront mods={mods} />
            </div>
          }
          back={
            <Switch on={status} handleChange={this.handlePowerChange} />
          }
        />
        <ExpandingHangar
          id={hangarId}
          height={ProtoFactory.height}
          width={50}
        />
      </Box>
    )
  }
}
