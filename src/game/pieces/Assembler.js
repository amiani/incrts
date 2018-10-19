import React from 'react'
import uuidv4 from 'uuid/v4'
import styled from 'styled-components'

import Building from './Building'
import BuildQueue from '../components/BuildQueue'
import { hardwareData } from './resources'
import Button from '../components/Button'
import ModulePanel from '../components/modules/ModulePanel'

const FrontBox = styled.div`
`

const BackBox = styled.div`
`

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
    return (
      <Building 
        width={ProtoAssembler.width}
        height={ProtoAssembler.height}
        message={this.state.message}
        front={
          <div>
            <BuildQueue id={this.props.assembler.buildQueueId} />
            <Button onClick={this.addProgress}>Assemble</Button>
            <ModulePanel modules={this.props.assembler.modules} />
          </div>
        }
        back={
          <BackBox>
          </BackBox>
        }
      />
    )
  }
}
