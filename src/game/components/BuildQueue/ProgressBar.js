import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  height: 10px;
`;

const Progress = styled.div`
  background-color: blue;
  width: ${p => p.progress > 100 ? 100 : p.progress}%;
  transition: width 150ms;
  height: 10px;
`;

export default props => (
  <Container>
    <Progress progress={props.progress} />
  </Container>
);
