import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
`;

const Button = styled.div`
  height: 12px;
  width: 18px;
  border: 2px black solid;

  &:hover {
    background-color: green;
  }
`;

export default props => (
  <Container>
    {props.label}
    <Button onClick={()=>props.set(props.amt-1)}>-1</Button>
    {props.amt}
    <Button onClick={()=>props.set(props.amt+1)}>+1</Button>
  </Container>
);
