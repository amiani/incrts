import React from 'react';
//import styled from 'styled-components';

import { GameContext } from '../gameContext';
import Building from './Building';

export const assemblerSize = {
  width: 200,
  height: 250,
};

export default class Assembler extends Building {
  constructor() {
    super(assemblerSize.width, assemblerSize.height);
  }

  static defaultCost = () => ({ credits: 50, fabric: 50 });

  name = 'assembler';
  drain = 1;

  update = () => {
    return this.drain;
  }

  Component = props => (
    <GameContext.Consumer>
      {store => (
        <this.Container>
          <p>Assembler</p>
          <button onClick={''}>Assemble</button>
        </this.Container>
      )}
    </GameContext.Consumer>
  );
}
