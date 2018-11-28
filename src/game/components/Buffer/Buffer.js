import React from 'react'
import styled from 'styled-components'

import LineChart from '../LineChart'
import broker from '../../broker'

const Box = styled.div`
  height: 25%;
  display: flex;
`

export default class Buffer extends React.Component {
  state = {
    capacity: 10,
    maxRate: 5,
    units: {
      tanks: []
    },
    unitCounts: {}
  }

  constructor(props) {
    super()
    this.box = React.createRef()
    broker.addListener(
      'update',
      { id: props.id, onmessage: this.handleUpdate }
    )
  }

  handleUpdate = body => this.setState({ ...body.buffers[this.props.id] })

  render() {
    return (
      <Box ref={this.box}>
        {this.box.current &&
          <LineChart
            data={this.state.unitCounts}
            width={this.box.current.clientWidth}
            height={this.box.current.clientHeight}
          />
        }
      </Box>
    )
  }
}
