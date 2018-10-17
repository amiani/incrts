import React from 'react'
import styled from 'styled-components'
import uuidv4 from 'uuid/v4'

import Building from './Building'
import Button from './components/Button'
import BuildQueue from './components/BuildQueue'
import ExpandingHangar from './components/Hangar/ExpandingHangar'
import { ProtoTank } from './units'

export function ProtoFactory() {
  this.id = uuidv4()
  this.type = 'factories'
  this.name = 'factory'
  this.cost = { credits: 50, fabric: 50 }
  this.drain = 1
  this.status = true
}
ProtoFactory.height = 300
ProtoFactory.width = 200

const Container = styled.div`
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
    const { buildQueueId, hangarId, status } = this.props.factory
    return (
      <Container>
        <Building
          width={ProtoFactory.width}
          height={ProtoFactory.height}
          front={
            <div>
              <BuildQueue id={buildQueueId} />
              <Button onClick={this.addProgress}>Build</Button>
              <Button onClick={this.enqueueTank}>Tank</Button>
            </div>
          }
          back={
            <div>
              Power: <input type='checkbox' value={status} defaultChecked={true} onChange={this.handlePowerChange} />
            </div>
          }
        />
        <ExpandingHangar
          id={hangarId}
          height={ProtoFactory.height}
          width={50}
        />
      </Container>
    )
  }
}
