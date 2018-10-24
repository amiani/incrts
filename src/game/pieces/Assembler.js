import React from 'react'
import styled from 'styled-components'

import Building from './Building'
import BuildQueue from '../components/BuildQueue'
import { hardwareData } from './resources'
import { ModPanelFront, ModPanelBack } from '../components/mods/ModPanel'
import { ProtoAssembler } from './prototypes'

const BoxFront = styled.div`
`

const BoxBack = styled.div`
`

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
            <ModPanelFront mods={this.props.assembler.mods} />
          </div>
        }
        back={
          <BoxBack>
            <ModPanelBack mods={this.props.assembler.mods} />
          </BoxBack>
        }
      />
    )
  }
}
