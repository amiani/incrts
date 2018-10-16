import React from 'react'
import styled from 'styled-components'
import uuidv4 from 'uuid/v4'

import GameContext from '../../../gameContext'
import ProgressBar from './ProgressBar'

export function ProtoBuildQueue(ownerId) {
  this.id = uuidv4()
  this.ownerId = ownerId
  this.progress = 0
  this.maxLength = 2
  this.items = []
  this.loop = true
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 48px;
  margin-bottom: 5px;
  border: 3px dashed ${p => p.loop ? 'blue' : 'transparent'};

  :hover {
    border: 3px dashed grey;
  }
`;

const QueueBox = styled.div`
  display: flex;
  height: 32px;
  border: 2px red;
  border-style: none none groove groove;
`;

const QueueItem = styled.div`
  height: 30px;
  width: 30px;
  background-image: url(images/${p => p.icon});
  background-size: 100% 100%;
`;

export default props => (
  <GameContext.Consumer>{store => {
    const data = store.buildQueues[props.id]
    return (
    <Container onDoubleClick={()=>store.toggleQueueLoop(props.id)} loop={data.loop}>
      <QueueBox>
        {data.items.map(q => <QueueItem key={q.id} icon={q.icon} />)}
      </QueueBox>
      <ProgressBar progress={data.progress} />
    </Container>
    )
  }}</GameContext.Consumer>
)
