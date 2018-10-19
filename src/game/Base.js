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
import { OBSERVEDBITS } from './constants'

const Box = styled.div`
  display: flex;
  flex-direction: column;
`

const BuildingRow = styled.div`
  display: flex;
  height: ${p => p.height}px;
  margin-bottom: 10px;
`;

export default class Base extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <GameContext.Consumer
        unstable_observedBits={OBSERVEDBITS.buildings}
      >{store => (
        <Box>
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
        </Box>
      )}</GameContext.Consumer>
    )
  }
}
