import React from 'react'
import styled from 'styled-components'

import broker from '../../broker'
import ProgressBar from './ProgressBar'

const Box = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 25%;
  margin-bottom: 5px;
  /*
  border: 3px dashed ${p => p.loop ? 'blue' : 'transparent'};

  :hover {
    border: 3px dashed grey;
  }
  */
`

const QueueBox = styled.div`
  display: flex;
  height: 75%;
  border: 2px red;
  border-style: none none groove groove;
`

const QueueItem = styled.div`
  height: 30px;
  width: 90%;
  background-image: url(images/${p => p.icon});
  background-size: 100% 100%;
  ${p => p.curr ? 'border: solid purple 2px' : null}
`

export default class Queue extends React.Component {
  state = {
    procedures: [],
    progress: 0
  }
  
  constructor(props) {
    super()
    this.id = props.id
    broker.addListener(
      'update',
      { id: this.id, onmessage: this.onmessage }
    )
  }

  onmessage = body => this.setState(body.queues[this.id])

  handleDragOver = event => {
    event.preventDefault()
    //select owner apparatus component and apply css hover state
  }

  handleDrop = event => {
    const procId = event.dataTransfer.getData('procId')
    broker.post({
      sub: 'enqueue',
      body: {
        queueId: this.id,
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
        <QueueBox>
          {this.state.procedures.map((proc, i) => (
            <QueueItem
              key={proc.id+i}
              icon={proc.icon}
              curr={this.state.currProc===i}
            />
          ))}
        </QueueBox>
        <ProgressBar progress={this.state.progress} />
      </Box>
    )
  }
}
