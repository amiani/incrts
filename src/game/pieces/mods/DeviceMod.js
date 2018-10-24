import React from 'react'
import styled from 'styled-components'

import Switch from '../../components/Switch'

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
