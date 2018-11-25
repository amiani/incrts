import React from 'react'
import styled from 'styled-components'

import Apparatus from './Apparatus'
import { ModPanelFront } from './mods/ModPanel'
import Button from '../components/Button'
import { ProtoGenerator, ProtoCrucible } from './prototypes'
import { BOARDANGLE } from '../constants'

const translationDist = 2*ProtoCrucible.height*Math.cos(Math.PI/2 - BOARDANGLE/4)
const translationAngle = Math.PI/2 - 3*BOARDANGLE/4
const HOVERDIST = 80
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

const BoxFront = styled.div`
`

export default props => (
  <Box>
    <Apparatus
      width={ProtoGenerator.width}
      height={ProtoGenerator.height}
      front={
        <BoxFront>
          <Button onClick={()=>props.store.addEnergy(10)}>Generate 10</Button>
          <ModPanelFront mods={props.generator.mods} />
        </BoxFront>
      }
      back={
        <p>This is the back of the Generator</p>
      }
    />
  </Box>
)
