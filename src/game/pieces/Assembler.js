import React from 'react';
//import styled from 'styled-components';

import { GameContext } from '../gameContext';
import Building from './Building';
import BuildQueue from '../components/BuildQueue';

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
  buildQueue = new BuildQueue();

  update = () => {
    return this.drain;
  }

  Component = props => (
    <GameContext.Consumer>
      {store => (
        <this.Container>
          <this.buildQueue.Component />
          <button onClick={()=>store.buildings.makeProgress()}>Assemble</button>
        </this.Container>
      )}
    </GameContext.Consumer>
  );
}
