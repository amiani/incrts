import React from 'react';
//import styled from 'styled-components';

import { GameContext } from '../gameContext';
import Building from './Building';
import UnselectableP from '../UnselectableP';

export const generatorSize = {
  width: 200,
  height: 200,
};

export default class Generator extends Building {
  constructor() {
    super(generatorSize.width, generatorSize.height);
  }

  static defaultCost = () => ({ credits: 50, fabric: 50 });

  income = 0;

  update = () => {
    return this.income;
  }

  name = 'generator';

  Component = props => (
    <GameContext.Consumer>
      {store => (
        <this.Container>
          <button onClick={() => store.resources.addEnergy(10)}>Generate 10</button>
        </this.Container>
      )}
    </GameContext.Consumer>
  );
}
