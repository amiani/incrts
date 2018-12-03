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
  enqueue = item => {
    broker.post({
      sub: 'enqueue',
      body: { 
        queueId: this.props.assembler.queueId, 
        item,
      }
    })
  }

  handleSpeedChange = amt => {
    broker.post({
      sub: 'tuneassembler',
      body: {
        assemblerId: this.props.assembler.id,
        speed: this.props.assembler.speed + amt
      }
    })
  }

  handleHarmChange = amt => {
    broker.post({
      sub: 'tuneassembler',
      body: {
        assemblerId: this.props.assembler.id,
        harm: this.props.assembler.harm + amt
      }
    })
  }

  render() {
    const { queueId, bufferId, speed, harm, mods } = this.props.assembler
    return (
      <Box>
        <Apparatus
          flippable
          width={ProtoAssembler.width}
          height={ProtoAssembler.height}
          front={
            <React.Fragment>
              <BuildBox>
                <Queue id={queueId} />
                <Oscillator
                  size={154}
                  harm={harm}
                />
              </BuildBox>
              <Buffer id={bufferId} />
              <ModPanelFront mods={mods} />
            </React.Fragment>
          }
          back={
            <React.Fragment>
              <Clock
                handleSpeedChange={this.handleSpeedChange}
                handleHarmChange={this.handleHarmChange}
                speed={speed}
                harm={harm}
              />
            </React.Fragment>
          }
        />
      </Box>
    )
  }
}
