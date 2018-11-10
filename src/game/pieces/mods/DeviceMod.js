import React from 'react'
import styled from 'styled-components'

import broker from '../../broker'
import Switch from '../../components/Switch'
import FlipSwitch from '../../components/FlipSwitch'
import Knob from  '../../components/Knob'

const Box = styled.div`
  display: flex;
`

export default class DeviceModControl extends React.Component {
  state = { testknobvalue: 50, status: true }
  constructor(props) {
    super()
    this.id = props.id
    broker.addListener(
      this.id,
      { id: this.id, onmessage: this.onmessage }
    )
  }

  onmessage = body => this.setState(body)

  handleClick = () => this.setState({ status: !this.state.status })

  handleChange = amt => {
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
        <FlipSwitch on={this.state.status} handleClick={this.handleClick} />
        <Knob
          value={this.state.testknobvalue}
          size={50}
          handleChange={this.handleChange}
        />
      </Box>
    )
  }
}
