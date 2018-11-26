import React from 'react'
import styled from 'styled-components'

import broker from '../../broker'
import ProgressBar from './ProgressBar'
import { ProtoAssembler } from '../../pieces/prototypes'

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
  height: 100%;
  width: ${p=>p.height}px;
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
    this.queueItem = React.createRef()
    broker.addListener(
      'update',
      { id: this.id, onmessage: this.handleMessage }
    )
  }

  handleMessage = body => this.setState(body.queues[this.id])

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
    let height
    if (this.queueItem.current)
      height = this.queueItem.current.offsetHeight
    return (
      <Box
        onDragOver={this.handleDragOver}
        onDrop={this.handleDrop}
      >
        <QueueBox>
          {this.state.procedures.map((proc, i) => (
            <QueueItem
              ref={this.queueItem}
              key={proc.id+i}
              icon={proc.icon}
              curr={this.state.currProc===i}
              height={height}
            />
          ))}
        </QueueBox>
        <ProgressBar progress={this.state.progress} />
      </Box>
    )
  }
}
