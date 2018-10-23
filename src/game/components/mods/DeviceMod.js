import React from 'react'
import uuidv4 from 'uuid/v4'
import styled from 'styled-components'

import Switch from '../Switch'

const Box = styled.div`
`

export default class DeviceModControl extends React.Component {
  handlePowerChange = () => {
  }

  render() {
    return (
      <Box>
        <Switch on={this.props.mod.status} handleChange={this.handlePowerChange} />
      </Box>
    )
  }
}
