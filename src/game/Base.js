import React from 'react'
import styled from 'styled-components'
import Lazy from 'lazy.js'

import broker from './broker'
import { ProtoAssembler, ProtoFactory, ProtoGenerator } from './pieces/prototypes'

import Factory from './pieces/Factory'
import Assembler from './pieces/Assembler'
import Generator from './pieces/Generator'

const Box = styled.div`
  display: flex;
  flex-direction: column;
`

const BuildingRow = styled.div`
  display: flex;
  height: ${p => p.height}px;
  margin-bottom: 10px;
`

export default class Base extends React.Component {
  state = {
    factories: {},
    assemblers: {},
    generators: {}
  }

  constructor() {
    super()
    broker.addListener(
      'buildings',
      { id: 'Base', onmessage: body => this.setState(body) }
    )
  }

  render() {
    return (
      <Box>
        <BuildingRow height={ProtoFactory.height+12}>
          {Lazy(this.state.factories).map(b => (
            <Factory
              key={b.id}
              factory={b}
            />
          )).toArray()}
        </BuildingRow>
        <BuildingRow height={ProtoAssembler.height+12}>
          {Lazy(this.state.assemblers).map(b => (
            <Assembler
              key={b.id}
              assembler={b}
            />
          )).toArray()}
        </BuildingRow>
        <BuildingRow height={ProtoGenerator.height+12}>
          {Lazy(this.state.generators).map(b => (
            <Generator
              key={b.id}
              generator={b}
            />
          )).toArray()}
        </BuildingRow>
      </Box>
    )
  }
}
