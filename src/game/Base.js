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
  width: 100%;
  background-color: #002836;
`

const Board = styled.div`
  display: grid;
  transform: rotate3d(1, 0, 0, 45deg);
  grid:
    "${p => 'assemblers '.repeat(p.cols)}" ${ProtoAssembler.height}px
    "${p => 'crucibles '.repeat(p.cols)}" ${ProtoCrucible.height}px
    "${p => 'generators '.repeat(p.cols)}" ${ProtoGenerator.height}px /
    ${p => '200px '.repeat(p.cols)}
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
