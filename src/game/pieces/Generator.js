import React from 'react';
//import styled from 'styled-components';

import Building, { Front, Back } from './Building';
import Button from './components/Button';

export const generatorData = {
  type: 'generators',
  name: 'generator',
  cost: { credits: 50, fabric: 50 },
  output: 0,
  width: 200,
  height: 200,
};

export default props => (
  <Building
    width={generatorData.width}
    height={generatorData.height}
    front={
      <Front>
        <Button onClick={()=>props.store.addEnergy(10)}>Generate 10</Button>
      </Front>
    }
  />
);
