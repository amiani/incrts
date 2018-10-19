import React from 'react'
import styled from 'styled-components'
import Lazy from 'lazy.js'

import ModFront from './ModFront'

const Box = styled.div`
  display: flex;
  flex-direction: column;
`

export const ModPanelFront = props => (
  <Box>
    {Lazy(props.mods).map(m => (
      <ModFront key={m.id} mod={m} />
    ))
    .toArray()}
  </Box>
)

export const ModPanelBack = props => (
  <Box>
    Back Mod Panel
  </Box>
)
