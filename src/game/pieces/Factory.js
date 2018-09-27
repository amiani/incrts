import React from 'react';
import styled from 'styled-components';
import uuidv4 from 'uuid/v4';

export const factorySize = {
  width: '200px',
  height: '300px'
};

const Container = styled.div`
  width: ${factorySize.width};
  height: ${factorySize.height};
  border: solid black 1px;
  margin: 0 5px 0 5px;
`;


export default class Factory {
  constructor() {
    this.key = uuidv4();
  }

  static defaultCost = () => ({ credits: 100 })

  update = () => {
  }

  toString = () => 'factory'
  
  getComponent = () => <this.Component key={this.key} />

  Component = class extends React.Component {
    state = {
      drain: 1
    }

    render() {
      return (
        <Container>
          <p>Factory</p>
        </Container>
      );
    }
  }
}
