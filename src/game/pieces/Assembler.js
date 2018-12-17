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
import { BOARDANGLE, BOARDDIST, PERSPECTIVE } from '../constants'
import Oscillator from '../components/Oscillator'
import Clock from './mods/Clock'

const HOVERDIST = 20
const transy = (-90/6)*(1+BOARDDIST/PERSPECTIVE)
const Box = styled.div`
  grid-row: 1;
  transform-origin: bottom;
  transition: transform ease 200ms;
  transform-style: preserve-3d;
  //transform: translate3d(0, ${transy}vh, ${-BOARDDIST}vh);
  /*
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
  */
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
    flipped: false,
  }

  constructor(props) {
    super()
    broker.addListener('update', props.id, this.handleUpdate)
    broker.addListener('procdragstart', props.id, this.handleProcDragStart)
    broker.addListener('procdragend', props.id, this.handleProcDragEnd)
  }

  handleUpdate = ({ assemblers }) => this.setState(assemblers[this.props.id])
  handleProcDragStart = body => this.setState({ flipped: true })
  handleProcDragEnd = body => {
    setTimeout(()=>this.setState({ flipped: false }), 500)
  }

  handleSpeedChange = amt => {
    broker.post({
      sub: 'tuneAssembler',
      body: {
        assemblerId: this.state.id,
        speed: this.state.speed.value + amt
      }
    })
  }

  handleHarmChange = amt => {
    broker.post({
      sub: 'tuneAssembler',
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
          flip={()=>this.setState((prev, _) => ({ flipped: !prev.flipped }))}
          flipped={this.state.flipped}
          width={ProtoAssembler.width}
          height={3/9}
          front={
            <React.Fragment>
              <BuildBox>
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
              <Queue id={this.state.queueId} />
            </React.Fragment>
          }
        />
      </Box>
    )
  }
}
