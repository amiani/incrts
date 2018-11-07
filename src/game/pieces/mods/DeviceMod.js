import React from 'react'
import styled from 'styled-components'

import broker from '../../broker'
import Switch from '../../components/Switch'
import Knob from  '../../components/Knob'

const Box = styled.div`
  display: flex;
`

export default class DeviceModControl extends React.Component {
  state = { testknobvalue: 50 }
  constructor(props) {
    super()
    this.id = props.id
    broker.addListener(
      this.id,
      { id: this.id, onmessage: this.onmessage }
    )
  }

  onmessage = body => this.setState(body)

  handlePowerChange = () => {
  }

  handleWheel = event => {
    const amt = event.deltaY < 0 ? 10 : -10
    broker.post({
      sub: 'updatemod',
      body: {
        modId: this.id,
        testknobvalue: this.state.testknobvalue + amt
      }
    })
  }

  render() {
    return (
      <Box>
        <Switch on={this.state.status} handleChange={this.handlePowerChange} />
        <Knob
          value={this.state.testknobvalue}
          size={50}
          handleWheel={this.handleWheel}
        />
      </Box>
    )
  }
}
