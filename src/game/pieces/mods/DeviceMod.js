import React from 'react'
import styled from 'styled-components'

import broker from '../../broker'
import Switch from '../../components/Switch'

const Box = styled.div`
`

export default class DeviceModControl extends React.Component {
  state = {}
  constructor(props) {
    super()
    this.id = props.id
    broker.addListener(
      this.id,
      { id: this.id, onmessage: this.onmessage }
    )
  }

  onmessage = body => {
  }

  handlePowerChange = () => {
  }

  render() {
    return (
      <Box>
        <Switch on={this.state.status} handleChange={this.handlePowerChange} />
      </Box>
    )
  }
}
