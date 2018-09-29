import React from 'react';
//import styled from 'styled-components';

import { GameContext } from '../gameContext';
import Building from './Building';
import BuildQueue from '../components/BuildQueue';
import UnselectableP from '../UnselectableP';

export const generatorData = {
  type: 'generators',
  name: 'generator',
  cost: { credits: 50, fabric: 50 },
  output: 0,
  width: 200,
  height: 200,
};

export default props => (
  <Building width={generatorData.width} height={generatorData.height}>
    <button onClick={()=>props.store.addEnergy(10)}>Generate 10</button>
  </Building>
);
