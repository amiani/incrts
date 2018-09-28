import React from 'react';
//import styled from 'styled-components';

import Building from './Building';
export const factorySize = {
  width: 200,
  height: 300,
};

export default class Factory extends Building {
  constructor() {
    super(factorySize.width, factorySize.width);
  }

  static defaultCost = () => ({ credits: 100 })

  drain = 1;

  update = () => {
    return this.drain;
  }

  Component = class extends React.Component {
    render() {
      return (
        <this.Container>
          <p>Factory</p>
        </this.Container>
      );
    }
  }
}
