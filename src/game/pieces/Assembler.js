import React from 'react'
import styled from 'styled-components'

import Building from './Building'
import BuildQueue from '../components/BuildQueue'
import { ModPanelFront, ModPanelBack } from './mods/ModPanel'
import { ProtoAssembler } from './prototypes'
import { RecipeSider } from '../components/recipes'
import Button from '../components/Button'
import { ProtoDeviceMod } from './mods/prototypes'
import broker from '../broker'

const Box = styled.div`
  display: flex;
`

const BoxFront = styled.div`
`

const BoxBack = styled.div`
`

export default class Assembler extends React.Component {
  state = { showSider: false }
  constructor(props) {
    super()
    this.id = props.assembler.id
  }

  enqueue = item => broker.post({
    sub: 'enqueue',
    body: {
      buildQueueId: this.props.assembler.buildQueueId,
      item
    }
  })

  addMod = () => broker.post({
    sub: 'addmod',
    body: {
      buildingId: this.id,
      type: 'assemblers',
      mod: new ProtoDeviceMod(this.id)
    }
  })

  toggleSider = () => this.setState({ showSider: !this.state.showSider })

  render() {
    return (
      <Box>
        <Building 
          width={ProtoAssembler.width}
          height={ProtoAssembler.height}
          message={this.state.message}
          showSider={this.toggleSider}
          front={
            <BoxFront>
              <BuildQueue id={this.props.assembler.buildQueueId} />
              <Button onClick={this.addMod}>Add Mod</Button>
              <ModPanelFront mods={this.props.assembler.mods} />
            </BoxFront>
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
