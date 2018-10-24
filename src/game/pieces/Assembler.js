import React from 'react'
import styled from 'styled-components'

import Building from './Building'
import BuildQueue from '../components/BuildQueue'
import { hardwareData } from './resources'
import { ModPanelFront, ModPanelBack } from '../components/mods/ModPanel'
import { ProtoAssembler } from './prototypes'
import { RecipeSider } from '../components/recipes'
import broker from '../broker'

const Box = styled.div`
  display: flex;
`

const BoxFront = styled.div`
`

const BoxBack = styled.div`
`

export default class Assembler extends React.Component {
  constructor(props) {
    super()
    this.id = props.assembler.id
  }

  state = { showSider: true }

  enqueue = item => broker.post({
    name: 'enqueue',
    body: {
      buildQId: this.props.assembler.buildQueueId,
      item
    }
  })

  render() {
    return (
      <Box>
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
        {this.state.showSider ? (
          <RecipeSider
            height={ProtoAssembler.height}
            recipes={this.props.assembler.recipes}
            enqueue={this.enqueue}
          />
        ): null}
      </Box>
    )
  }
}
