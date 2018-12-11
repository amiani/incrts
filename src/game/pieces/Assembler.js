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
import Clock from './mods/Clock'

const HOVERDIST = 20
const Box = styled.div`
  grid-row: 3;
  transform-origin: bottom;
  transition: transform ease 200ms;
  transform-style: preserve-3d;
  :active, :hover {
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
  state = {
    queueId: null,
    bufferId: null,
    speed: {},
    harm: {},
    oscillator: { position: { x: 0, y: 0 } },
    mods: [],
  }

  constructor(props) {
    super()
    broker.addListener('update', props.id, this.handleUpdate)
  }

  handleUpdate = ({ assemblers }) => this.setState(assemblers[this.props.id])

  enqueue = item => {
    broker.post({
      sub: 'enqueue',
      body: { 
        queueId: this.state.queueId, 
        item,
      }
    })
  }

  handleSpeedChange = amt => {
    broker.post({
      sub: 'tuneassembler',
      body: {
        assemblerId: this.state.id,
        speed: this.state.speed.value + amt
      }
    })
  }

  handleHarmChange = amt => {
    broker.post({
      sub: 'tuneassembler',
      body: {
        assemblerId: this.state.id,
        harm: this.state.harm.value + amt
      }
    })
  }

  render() {
    return (
      <Box>
        <Apparatus
          flippable
          width={ProtoAssembler.width}
          height={ProtoAssembler.height}
          front={
            <React.Fragment>
              <BuildBox>
                <Queue id={this.state.queueId} />
                <Oscillator
                  size={154}
                  harm={this.state.harm.value}
                  position={this.state.oscillator.position}
                  velocty={this.state.oscillator.velocity}
                />
              </BuildBox>
              <Buffer id={this.state.bufferId} />
              <Clock
                handleSpeedChange={this.handleSpeedChange}
                handleHarmChange={this.handleHarmChange}
                speed={this.state.speed}
                harm={this.state.harm}
              />
              <ModPanelFront mods={this.state.mods} />
            </React.Fragment>
          }
          back={
            <React.Fragment>
            </React.Fragment>
          }
        />
      </Box>
    )
  }
}
