import React from 'react'
import styled from 'styled-components'
import Lazy from 'lazy.js'

import broker from '../broker'

const Box = styled.div`
  display: flex;
  box-shadow: inset 0px 0px 5px 5px rgba(0,0,0,0.75);
  border: solid 1px #ee855e;
  height: 80px;
`

const Bar = styled.div`
  background-color: ${p=>p.color};
  height: 100%;
  width: ${p=>p.width}%;
  color: #fff;
  opacity: .5;
`

export default class Stack extends React.Component {
  state = {
    procedures: {}
  }

  constructor(props) {
    super()
    broker.addListener('update', props.id, this.onUpdate)
    broker.addListener(props.id, props.id, this.onDirect)
  }

  onUpdate = body => this.setState(body.stacks[this.props.id])
  onDirect = () => {}

  handleDragOver = event => {
    event.preventDefault()
    //select owner apparatus component and apply hover state
  }

  handleDrop = event => {
    const procId = event.dataTransfer.getData('procId')
    broker.post({
      sub: 'enstack',
      body: {
        stackId: this.props.id,
        procId
      }
    })
  }

  render() {
    return (
      <Box
        onDragOver={this.handleDragOver}
        onDrop={this.handleDrop}
      >
        {Lazy(this.state.procedures)
          .map(p => (
            <Bar
              key={p.id}
              color={p.color}
              width={p.priority}
            >
              {p.priority}
            </Bar>
          ))
          .toArray()
        }
      </Box>
    )
  }
}
