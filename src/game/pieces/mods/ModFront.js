import React from 'react'
import styled from 'styled-components'

import broker from '../../broker'

const Box = styled.div`
  display: flex;
  height: 50px;
`

const ModIcon = styled.div`
  height: 48px;
  width: 48px;
  background-image: url(images/${p => p.icon});
  background-size: 100% 100%;
  flex-shrink: 0;

  :hover {
    background-image:
      url(images/modupgradearrow.png);
  }
`

export default class ModFront extends React.Component {
  state = {}
  constructor(props) {
    super()
    this.id = props.id
    broker.addListener(
      this.id,
      { id: this.id, onmessage: this.onmessage }
    )
  }

  onmessage = body => this.setState(body)

  render() {
    return (
      <Box>
        <ModIcon icon={this.state.icon} />
      </Box>
    )
  }
}
