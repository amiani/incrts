import React from 'react'
import styled from 'styled-components'

import Knob from '../../components/Knob'

const Box = styled.div`
  display: flex;
  height: 25%;
  align-items: center;
`

export default props => (
  <Box>
    <Knob
      value={props.speed}
      min={0}
      max={50}
      step={2}
      size={154}
      handleChange={props.handleSpeedChange}
      label='Speed'
    />
    <Knob
      value={props.harm}
      min={0}
      max={50}
      step={2}
      size={77}
      handleChange={props.handleHarmChange}
      label='Harmonizer'
    />
  </Box>
)
