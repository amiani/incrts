import React from 'react';
import styled from 'styled-components';

import { assemblerSize } from './pieces/Assembler';
import { factorySize } from './pieces/Factory';
import { generatorSize } from './pieces/Generator';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

/*
const FactoryRow = styled.div`
  display: flex;
  height: ${factorySize.height};
  margin-bottom: 10px;
`;

const AssemblerRow = styled.div`
  display: flex;
  height: ${assemblerSize.height};
`;
*/

const BuildingRow = styled.div`
  display: flex;
  height: ${p => p.height}px;
  margin-bottom: 10px;
`;

export default props => (
  <Container>
    <BuildingRow height={factorySize.height+12}>
      {props.store.buildings.factories.map(f=>f.getComponent())}
    </BuildingRow>
    <BuildingRow height={assemblerSize.height+12}>
      {props.store.buildings.assemblers.map(f=>f.getComponent())}
    </BuildingRow>
    <BuildingRow height={generatorSize.height+12}>
      {props.store.buildings.generators.map(g=>g.getComponent())}
    </BuildingRow>
  </Container>
);
