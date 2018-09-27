import React from 'react';
import uuidv4 from 'uuid/v4';
import styled from 'styled-components';

export const assemblerSize = {
  width: '200px',
  height: '250px',
};

const Container = styled.div`
  width: ${assemblerSize.width};
  height: ${assemblerSize.height};
  border solid black 1px;
  margin 0 5px 0 5px;
`;

export default class Assembler {
  constructor() {
    this.key = uuidv4();
  }

  static defaultCost = () => ({ credits: 50, fabric: 50 })

  counter = 0;
  drain = 1;

  update = () => {
    this.counter++;
    return this.drain;
  }

  toString = () => 'assembler'

  getComponent = () => (
    <this.Component
      key={this.key}
      counter={this.counter}
    />
  )

  Component = props => (
    <Container>
      <p>Assembler</p>
      <p>{props.counter}</p>
      <button onClick={''}>Test</button>
    </Container>
  )
}
