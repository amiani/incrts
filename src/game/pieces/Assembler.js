import React from 'react'
import styled from 'styled-components'

import Building from './Building'
import BuildQueue from '../components/BuildQueue'
import { ModPanelFront, ModPanelBack } from '../components/mods/ModPanel'
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
  state = { showSider: true }
  constructor(props) {
    super()
    this.id = props.assembler.id
  }

  enqueue = item => broker.post({
    name: 'enqueue',
    body: {
      buildQueueId: this.props.assembler.buildQueueId,
      item: { ...item }
    }
  })

  addMod = () => broker.post({
    name: 'addmod',
    body: {
      buildingId: this.id,
      type: 'assemblers',
      mod: new ProtoDeviceMod()
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
