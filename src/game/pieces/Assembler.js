import React from 'react'
import styled from 'styled-components'

import Apparatus from './Apparatus'
import Button from '../components/Button'
import Queue from '../components/Queue'
import Buffer from '../components/Buffer'
import { ModPanelFront } from './mods/ModPanel'
import Switch from '../components/Switch'
import { ProtoAssembler } from './prototypes'
import broker from '../broker'
import { ProcedureSider } from '../components/procedures'
import { BOARDANGLE } from '../constants'
import Oscillator from '../components/Oscillator'

const HOVERDIST = 20
const Box = styled.div`
  grid-row: 3;
  transform-origin: bottom;
  transition: transform ease 200ms;
  transform-style: preserve-3d;
  :hover {
    transform:
      rotate3d(1, 0, 0, -5deg)
      translate3d(
        0,
        ${-HOVERDIST*Math.cos(BOARDANGLE)}px,
        ${HOVERDIST*Math.sin(BOARDANGLE)}px
      )
    ;
  }
`

const BuildBox = styled.div`
  display: flex;
  height: 25%;
`

export default class Assembler extends React.Component {
  constructor(props) {
    super()
    this.id = props.assembler.id
  }
  
  enqueue = item => {
    broker.post({
      sub: 'enqueue',
      body: { 
        queueId: this.props.assembler.queueId, 
        item,
      }
    })
  }

  handlePowerChange = e => {
    broker.post({
      sub: 'togglepower',
      body: { apparatusId: this.id }
    })
  }

  render() {
    const { queueId, bufferId, status, mods } = this.props.assembler
    return (
      <Box>
        <Apparatus
          flippable
          width={ProtoAssembler.width}
          height={ProtoAssembler.height}
          showSider={this.toggleSider}
          front={
            <React.Fragment>
              <BuildBox>
                <Queue id={queueId} />
                <Oscillator
                  size={154}
                />
              </BuildBox>
              <Buffer id={bufferId} />
              <ModPanelFront mods={mods} />
            </React.Fragment>
          }
          back={
            <Switch on={status} handleChange={this.handlePowerChange} />
          }
        />
      </Box>
    )
  }
}
