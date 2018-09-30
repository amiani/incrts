import React from 'react';
import uuidv4 from 'uuid/v4';
//import styled from 'styled-components';

import { GameContext } from '../gameContext';
import Building from './Building';
import BuildQueue from '../components/BuildQueue';

export const assemblerData = {
  type: 'assemblers',
  name: 'assembler',
  cost: { credits: 50, fabric: 50 },
  drain: 1,
  width: 200,
  height: 250,
};

export default props => (
  <Building width={assemblerData.width} height={assemblerData.height}>
    <BuildQueue
      queue={props.buildQueue.queue}
      progress={props.buildQueue.progress}
    />
    <button onClick={()=>props.makeProgress(props.data.id, 10)}>Assemble</button>
  </Building>
);
