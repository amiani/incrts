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
      <ModFront key={m.id} mod={m} />
    ))
    .toArray()}
  </Box>
)

export class ModPanelBack extends React.Component {
  state = { mods: {} }
  constructor(props) {
    super()
    this.id = uuidv4()
    broker.addListener(
      'mods',
      { id: this.id, onmessage: this.onmessage }
    )
  }

  onmessage = body => this.setState(body)

  render() {
    let Control
    return (
      <Box>
        {Lazy(this.props.mods).map(m => {
          Control = controlMap[m]
          return <Control key={m.id} id={m} />
        })
        .toArray()}
      </Box>
    )
  }
}
