import React from 'react'
import styled from 'styled-components'

import Building from './Building'
import BuildQueue from '../components/BuildQueue'
import { ModPanelFront, ModPanelBack } from './mods/ModPanel'
import { ProtoCrucible } from './prototypes'
import { ProcedureSider } from '../components/procedures'
import Button from '../components/Button'
import { ProtoDeviceMod } from './mods/prototypes'
import broker from '../broker'

const Box = styled.div`
  display: flex;
  grid-row: 2;
`

const BoxFront = styled.div`
`

const BoxBack = styled.div`
`

export default class Crucible extends React.Component {
  state = { showSider: true }
  constructor(props) {
    super()
    this.id = props.crucible.id
  }

  enqueue = item => broker.post({
    sub: 'enqueue',
    body: {
      buildQueueId: this.props.crucible.buildQueueId,
      item
    }
  })

  addMod = () => broker.post({
    sub: 'addmod',
    body: {
      buildingId: this.id,
      type: 'crucibles',
      mod: new ProtoDeviceMod(this.id)
    }
  })

  toggleSider = () => this.setState({ showSider: !this.state.showSider })

  render() {
    return (
      <Box>
        <Building 
          width={ProtoCrucible.width}
          height={ProtoCrucible.height}
          message={this.state.message}
          showSider={this.toggleSider}
          front={
            <BoxFront>
              <BuildQueue id={this.props.crucible.buildQueueId} />
              <Button onClick={this.addMod}>Add Mod</Button>
              <ModPanelFront mods={this.props.crucible.mods} />
            </BoxFront>
          }
          back={
            <BoxBack>
              <ModPanelBack mods={this.props.crucible.mods} />
            </BoxBack>
          }
        />
      </Box>
    )
  }
}
