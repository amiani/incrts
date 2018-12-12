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
    props.id = props.id
    broker.addListener(props.id, props.id, this.handleMessage)
  }

  handleMessage = body => this.setState(body)

  handleClick = () => this.setState({ status: !this.state.status })

  handleChange = amt => {
    broker.post({
      sub: 'tuneMod',
      body: {
        modId: this.props.id,
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
          min={0}
          max={100}
          step={10}
          size={50}
          handleChange={this.handleChange}
        />
      </Box>
    )
  }
}
