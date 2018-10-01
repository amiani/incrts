import React from 'react';
import styled from 'styled-components';

import ProgressBar from './ProgressBar';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 40px;
  margin: 5px 0 5px 0;
`;

const QueueBox = styled.div`
  display: flex;
  height: 30px;
  border: solid 1px red;
`;

const QueueItem = styled.div`
  height: 30px;
  width: 30px;
  background-image: url(images/${p => p.icon});
`;

export default props => (
  <Container>
    <QueueBox>
      {props.items.map(q => <QueueItem key={q.id} icon={q.icon} />)}
    </QueueBox>
    <ProgressBar progress={props.progress} />
  </Container>
);
