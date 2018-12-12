import React from 'react'
import styled from 'styled-components'

import Apparatus from './Apparatus'
import PreaccDisplay from '../components/PreaccDisplay'
import { ModPanelFront } from './mods/ModPanel'
import Button from '../components/Button'
import { ProtoPreaccelerator, ProtoCrucible } from './prototypes'
import { BOARDANGLE } from '../constants'

const translationDist = 2*ProtoCrucible.height*Math.cos(Math.PI/2 - BOARDANGLE/4)
const translationAngle = Math.PI/2 - 3*BOARDANGLE/4
const HOVERDIST = 200
const Box = styled.div`
  grid-row: 1;
  transform-origin: bottom;
  transform-style: preserve-3d;
  transition: transform ease 200ms;
  transform:
    rotate3d(1, 0, 0, ${-BOARDANGLE}rad)
    translate3d(
      0,
      ${-translationDist*Math.cos(translationAngle)}vh,
      ${translationDist*Math.sin(translationAngle)}vh
    );

  :hover {
    transform:
      rotate3d(1, 0, 0, ${-Math.PI/16}rad)
      translate3d(
        0,
        ${HOVERDIST*Math.cos(BOARDANGLE)}px,
        ${HOVERDIST*Math.cos(BOARDANGLE)}px
      )
      rotate3d(1, 0, 0, ${-BOARDANGLE}rad)
      translate3d(
        0,
        ${-translationDist*Math.cos(translationAngle)}vh,
        ${translationDist*Math.sin(translationAngle)}vh
      );
  }
`

export default class Preaccelerator extends React.Component {
  state = {
    flipped: false,
  }

  smash = () => {
  }

  render() {
    return (
      <Box>
        <Apparatus
          flippable
          flip={()=>this.setState((prev, _) => ({ flipped: !prev.flipped }))}
          width={ProtoPreaccelerator.width}
          height={ProtoPreaccelerator.height}
          header={
            <React.Fragment>
            </React.Fragment>
          }
          front={
            <React.Fragment>
              <PreaccDisplay onSmash={this.smash} numParticles={200} />
              <ModPanelFront mods={this.props.preaccelerator.mods} />
            </React.Fragment>
          }
          back={
            <p>This is the back of the Preaccelerator</p>
          }
        />
      </Box>
    )
  }
}
