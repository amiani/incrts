import React from 'react';
import styled from 'styled-components';
import Lazy from 'lazy.js';

import { GameContext } from './gameContext';
import { assemblerData } from './pieces/Assembler';
import { factoryData } from './pieces/Factory';
import { generatorData } from './pieces/Generator';

import Factory from './pieces/Factory';
import Assembler from './pieces/Assembler';
import Generator from './pieces/Generator';

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
  <GameContext.Consumer>{store => (
    <Container>
      <BuildingRow height={factoryData.height+12}>
        {Lazy(store.factories).map(b => (
          <Factory
            key={b.id}
            data={b}
            buildQueue={store.buildQueues[b.id]}
            store={store}
          />
        )).toArray()}
      </BuildingRow>
      <BuildingRow height={assemblerData.height+12}>
        {Lazy(store.assemblers).map(b => (
          <Assembler
            key={b.id}
            data={b}
            buildQueue={store.buildQueues[b.id]}
            store={store}
          />
        )).toArray()}
      </BuildingRow>
      <BuildingRow height={generatorData.height+12}>
        {Lazy(store.generators).map(b => (
          <Generator
            key={b.id}
            data={b}
            store={store}
          />
        )).toArray()}
      </BuildingRow>
    </Container>
  )}</GameContext.Consumer>
);
