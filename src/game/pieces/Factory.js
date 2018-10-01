import React from 'react';
//import styled from 'styled-components';

import Building from './Building';
import BuildQueue from '../components/BuildQueue';
export const factoryData = {
  type: 'factories',
  name: 'factory',
  cost: { credits: 50, fabric: 50 },
  drain: 1,
  width: 200,
  height: 300,
};

export default props => (
  <Building
    width={factoryData.width}
    height={factoryData.height}
    front={
      <BuildQueue
        items={props.buildQueue.items}
        progress={props.buildQueue.progress}
      />
    }
  />
);
