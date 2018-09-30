import React from 'react';
import styled from 'styled-components';

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
        {Object.values(props.store.factories).map(b => (
        <Factory
          key={b.id}
          data={b}
          buildQueue={store.buildQueues.get(b.id)}
        />
        ))}
      </BuildingRow>
      <BuildingRow height={assemblerData.height+12}>
        {Object.values(props.store.assemblers).map(b => (
          <Assembler
            key={b.id}
            data={b}
            buildQueue={store.buildQueues.get(b.id)}
            makeProgress={p => store.makeProgress(p)}
          />
        ))}
      </BuildingRow>
      <BuildingRow height={generatorData.height+12}>
        {Object.values(props.store.generators).map(b => (
          <Generator key={b.id} data={b} store={props.store} />
        ))}
      </BuildingRow>
    </Container>
  )}</GameContext.Consumer>
);
