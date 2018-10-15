import React from 'react'
import uuidv4 from 'uuid/v4'

import Building from './Building'
import BuildQueue from './components/BuildQueue'
import { hardwareData } from './resources'
import Button from './components/Button'

export function ProtoAssembler() {
  this.id = uuidv4()
  this.type = 'assemblers'
  this.name = 'assembler'
  this.cost = { credits: 50, fabric: 50 }
  this.drain = 1
}
ProtoAssembler.width = 200
ProtoAssembler.height = 250

export default class Assembler extends React.Component {
  constructor(props) {
    super()
    this.id = props.assembler.id
  }

  state = { message: '' }

  addProgress = () => {
    this.props.store.addProgress(
      this.props.assembler.buildQueueId,
      50*this.props.store.productivity
    )
      .catch(error => this.setState({ message: error }))
  }

  enqueueHardware = () => {
    this.props.store.enqueue(this.props.assembler.buildQueueId, new hardwareData())
      .catch(error => this.setState({ message: error }))
  }

  render() {
    const { buildQueueId } = this.props.assembler
    const buildQueue = this.props.store.buildQueues[buildQueueId]
    return (
      <Building 
        width={ProtoAssembler.width}
        height={ProtoAssembler.height}
        message={this.state.message}
        front={
          <div>
            <BuildQueue
              items={buildQueue.items}
              progress={buildQueue.progress}
              loop={buildQueue.loop}
              toggleLoop={()=>this.props.store.toggleQueueLoop(buildQueueId)}
            />
            <Button onClick={this.addProgress}>Assemble</Button>
            <Button onClick={this.enqueueHardware}>Hardware</Button>
          </div>
        }
      />
    );
  }
}
