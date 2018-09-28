import React from 'react';
import styled from 'styled-components';

import ProgressBar from './ProgressBar';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 40px;
  border: solid black 1px;
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
  background-color: green;
`;

export default class BuildQueue {
  queue = [];
  progress = 0;

  update = () => {
  };

  makeProgress = amount => {
    this.progress += amount;
    console.log('makeProgress');
  }

  Component = props => (
    <Container>
      <QueueBox>
        <QueueItem />
      </QueueBox>
      <ProgressBar progress={this.progress} />
    </Container>
  );
}
