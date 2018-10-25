import React from 'react'
import styled from 'styled-components'
import Lazy from 'lazy.js'
import uuidv4 from 'uuid/v4'

import ModFront from './ModFront'
import controlMap from './controlMap'
import broker from '../../broker'

const Box = styled.div`
  display: flex;
  flex-direction: column;
`

export const ModPanelFront = props => (
  <Box>
    {Lazy(props.mods).map(m => (
      <ModFront key={m} id={m} />
    ))
    .toArray()}
  </Box>
)

export class ModPanelBack extends React.Component {
  render() {
    let Control
    return (
      <Box>
        {Lazy(this.props.mods).map(m => {
          Control = controlMap[m]
          return <Control key={m} id={m} />
        })
        .toArray()}
      </Box>
    )
  }
}
