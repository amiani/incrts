import React from 'react'
import styled from 'styled-components'
import Lazy from 'lazy.js'

const Box = styled.div`
  display: flex;
  flex-direction: column;
`

export const FrontModPanel = props => (
  <Box>
    {Lazy(props.mods).map(m => (
      <m.Component data={m} />
    ))
    .toArray()}
  </Box>
)

export const BackModPanel = props => (
  <Box>
    Back Mod Panel
  </Box>
)
