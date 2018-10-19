import React from 'react';
import styled from 'styled-components';

const Box = styled.div`
  height: 10px;
  border: 2px blue;
  border-style: none none groove groove;
`;

const Progress = styled.div`
  background-color: blue;
  transform-origin: left;
  transform: scaleX(${p => p.progress > 100 ? 1 : p.progress/100});
  transition: transform ease 150ms;
  height: 10px;
`;
//width: ${p => p.progress > 100 ? 100 : p.progress}%;

export default props => (
  <Box>
    <Progress progress={props.progress} />
  </Box>
);
