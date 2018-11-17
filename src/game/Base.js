import React from 'react'
import styled from 'styled-components'
import Lazy from 'lazy.js'

import broker from './broker'
import { ProtoCrucible, ProtoAssembler, ProtoGenerator } from './pieces/prototypes'
import Assembler from './pieces/Assembler'
import Crucible from './pieces/Crucible'
import Generator from './pieces/Generator'

const Box = styled.div`
  height: 100%;
  padding: 5px;
  /*perspective: 1000px;*/
  /*transform: rotate3d(1, 0, 0, 35deg);*/
`

const Board = styled.div`
  display: grid;
  --cols: ${p=>p.cols};
  grid:
    "repeat(var(--cols), assemblers)" ${ProtoAssembler.height}
    "repeat(var(--cols), crucibles)" ${ProtoCrucible.height}
    "repeat(var(--cols), generators)" ${ProtoGenerator.height} \
    repeat(var(--cols), ${ProtoAssembler.width}";
`

const BuildingRow = styled.div`
  display: flex;
  grid-area: ${p=>p.area};
  align-self: center;
  overflow: auto;
  transform-style: preserve-3d;
`

export default class Base extends React.Component {
  state = {
    assemblers: {},
    crucibles: {},
    generators: {},
    orders: {}
  }

  constructor() {
    super()
    broker.addListener(
      'buildings',
      { id: 'Base', onmessage: body => this.setState(body) }
    )
    broker.addListener(
      'building',
      {
        id: 'Base',
        onmessage: b => this.setState((prev, _) => ({
          [b.type]: { ...prev[b.type], [b.id]: b }
        }))
      }
    )
  }

  render() {
    const cols = Math.max(
      Object.keys(this.state.assemblers).length,
      Object.keys(this.state.crucibles).length,
      Object.keys(this.state.generators).length,
    )
    return (
      <Box>
        <Board cols={cols}>
          {Lazy(this.state.assemblers).map(a => (
            <Assembler
              key={a.id}
              assembler={a}
            />
          )).toArray()}
          {Lazy(this.state.crucibles).map(b => (
            <Crucible
              key={b.id}
              assembler={b}
            />
          )).toArray()}
          {Lazy(this.state.generators).map(b => (
            <Generator
              key={b.id}
              generator={b}
            />
          )).toArray()}
        </Board>
      </Box>
    )
  }
}
