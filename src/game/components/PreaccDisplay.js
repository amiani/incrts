import React from 'react'
import styled from 'styled-components'

import Prering from './Prering'
import { ProtoPreaccelerator } from '../pieces/prototypes'

const Box = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`

const InfoBox = styled.div`
`

const PreringOverlay = styled(Prering)`
  position: absolute;
  top: 25px;
  left: 0;
`

export default props => {
  return (
    <Box>
      <InfoBox>
        NumberPart: 15
      </InfoBox>
      <PreringOverlay size={ProtoPreaccelerator.width} numParticles={20} />
    </Box>
  )
}
