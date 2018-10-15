import React from 'react'
import styled from 'styled-components'
import Lazy from 'lazy.js'

import GameContext from './gameContext'
import { ProtoAssembler } from './pieces/Assembler'
import { ProtoFactory } from './pieces/Factory'
import { ProtoGenerator } from './pieces/Generator'

import Factory from './pieces/Factory'
import Assembler from './pieces/Assembler'
import Generator from './pieces/Generator'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const BuildingRow = styled.div`
  display: flex;
  height: ${p => p.height}px;
  margin-bottom: 10px;
`;

export default props => (
  <GameContext.Consumer
    unstable_observedBits={OBSERVEDBITS.buildingsLength}
  >{store => (
    <Container>
      <BuildingRow height={ProtoFactory.height+12}>
        {Lazy(store.factories).map(b => (
          <Factory
            key={b.id}
            factory={b}
            store={store}
          />
        )).toArray()}
      </BuildingRow>
      <BuildingRow height={ProtoAssembler.height+12}>
        {Lazy(store.assemblers).map(b => (
          <Assembler
            key={b.id}
            assembler={b}
            store={store}
          />
        )).toArray()}
      </BuildingRow>
      <BuildingRow height={ProtoGenerator.height+12}>
        {Lazy(store.generators).map(b => (
          <Generator
            key={b.id}
            generator={b}
            store={store}
          />
        )).toArray()}
      </BuildingRow>
    </Container>
  )}</GameContext.Consumer>
)
