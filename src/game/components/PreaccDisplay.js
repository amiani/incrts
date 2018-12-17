import React from 'react'
import styled from 'styled-components'

import Button from './Button'
import Prering from './Prering'
import { ProtoPreaccelerator } from '../pieces/prototypes'

const Box = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
`

const SmashButton = styled(Button)`
  height: 30px;
  font-size: 30px;
`

const PreringOverlay = styled(Prering)`
  position: absolute;
  top: 25px;
  left: 0;
  z-index: -1;
`

export default props => {
  return (
    <Box>
      <PreringOverlay size={300} numParticles={20} />
      <InfoBox>
        <SmashButton onClick={props.onSmash}>Smash!</SmashButton>
        Particles In: 100
      </InfoBox>
    </Box>
  )
}
