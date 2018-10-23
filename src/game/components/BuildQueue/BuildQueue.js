import React from 'react'
import styled from 'styled-components'

import broker from '../../broker'
import ProgressBar from './ProgressBar'

const Box = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 48px;
  margin-bottom: 5px;
  border: 3px dashed ${p => p.loop ? 'blue' : 'transparent'};

  :hover {
    border: 3px dashed grey;
  }
`

const QueueBox = styled.div`
  display: flex;
  height: 32px;
  border: 2px red;
  border-style: none none groove groove;
`

const QueueItem = styled.div`
  height: 30px;
  width: 30px;
  background-image: url(images/${p => p.icon});
  background-size: 100% 100%;
`

export default class BuildQueue extends React.Component {
  state = {
    items: [],
    loop: true,
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

  onmessage = body => {
    body[this.id] && this.setState(body[this.id])
  }

  handleDoubleClick = () => broker.post({ name: 'toggleloop', id: this.id })

  render() {
    return (
      <Box onDoubleClick={this.handleDoubleClick} loop={this.state.loop}>
        <QueueBox>
          {this.state.items.map(q => <QueueItem key={q.id} icon={q.icon} />)}
        </QueueBox>
        <ProgressBar progress={this.state.progress} />
      </Box>
    )
  }
}
