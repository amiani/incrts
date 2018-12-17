import React from 'react'
import styled from 'styled-components'

import Knob from '../../components/Knob'

const Box = styled.div`
  display: flex;
  height: 33.33%;
  align-items: center;
`

export default class Clock extends React.Component {
  constructor(props) {
    super()
    this.box = React.createRef()
  }

  render() {
    return (
      <Box ref={this.box}>
        {this.box.current && <React.Fragment>
          <Knob
            value={this.props.speed.value}
            min={this.props.speed.min}
            max={this.props.speed.max}
            step={2}
            size={this.box.current.clientHeight}
            handleChange={this.props.handleSpeedChange}
            label='Speed'
          />
          <Knob
            value={this.props.harm.value}
            min={this.props.harm.min}
            max={this.props.harm.max}
            step={2}
            size={this.box.current.clientHeight}
            handleChange={this.props.handleHarmChange}
            label='Harmonizer'
          />
        </React.Fragment>}
      </Box>
    )
  }
}
