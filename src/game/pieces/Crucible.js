import React from 'react'
import styled from 'styled-components'

import Apparatus from './Apparatus'
import Stack from '../components/Stack'
import { ModPanelFront, ModPanelBack } from './mods/ModPanel'
import { ProtoCrucible, ProtoAssembler } from './prototypes'
import { ProcedureSider } from '../components/procedures'
import Button from '../components/Button'
import { ProtoDeviceMod } from './mods/prototypes'
import broker from '../broker'
import { BOARDANGLE } from '../constants'

const HOVERDIST = -ProtoAssembler.height/2*Math.cos(Math.PI-BOARDANGLE)

const Box = styled.div`
  grid-row: 2;
  transform-origin: bottom;
  transition: transform ease 200ms;
  transform-style: preserve-3d;
  transform: rotate3d(1, 0, 0, ${-BOARDANGLE/2}rad);

  :hover {
    transform:
      rotate3d(1, 0, 0, ${-3*BOARDANGLE/4}rad)
      translate3d(
        0,
        ${HOVERDIST*Math.cos(BOARDANGLE)}vh, 
        ${HOVERDIST*Math.sin(BOARDANGLE)}vh
      )
  }
`

const Drain = styled.div`
  font-size: 15px;
  text-align: bottom;
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
      queueId: this.props.crucible.queueId,
      item
    }
  })

  addMod = () => broker.post({
    sub: 'addMod',
    body: {
      apparatusId: this.id,
      type: 'crucibles',
      mod: new ProtoDeviceMod(this.id)
    }
  })

  toggleSider = () => this.setState({ showSider: !this.state.showSider })

  render() {
    return (
      <Box>
        <Apparatus 
          flippable
          width={ProtoCrucible.width}
          height={ProtoCrucible.height}
          message={this.state.message}
          header={
            <React.Fragment>
              <Drain>Drain: {this.props.crucible.drain}</Drain>
            </React.Fragment>
          }
          front={
            <React.Fragment>
              <Stack id={this.props.crucible.stackId} />
              <Button onClick={this.addMod}>Add Mod</Button>
              <ModPanelFront mods={this.props.crucible.mods} />
            </React.Fragment>
          }
          back={
            <ModPanelBack mods={this.props.crucible.mods} />
          }
        />
      </Box>
    )
  }
}
