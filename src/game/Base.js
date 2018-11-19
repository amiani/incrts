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
  color: white;
  perspective: 1000px;
  overflow: hidden;
`

const Board = styled.div`
  display: grid;
  transform: translate3d(0, ${p => -p.t*Math.acos(p.p)}px, ${p => -p.t*Math.asin(p.p)}px) rotate3d(1, 0, 0, ${p=>p.p}rad);
  transform-style: preserve-3d;
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
    orders: {},

    perspective: 0,
    translation: 0
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


  handlePerspectiveChange = event => this.setState({ perspective: event.target.value })

  handleTranslationChange = event => this.setState({ translation: event.target.value })

  render() {
    const cols = Math.max(
      Object.keys(this.state.assemblers).length,
      Object.keys(this.state.crucibles).length,
      Object.keys(this.state.generators).length,
    )
    return (
      <Box>
        <p>{Math.PI/this.state.perspective}</p>
        <input
          type='range'
          min='0'
          max={Math.PI/2}
          value={this.state.perspective}
          onChange={this.handlePerspectiveChange}
          step={Math.PI/32}
        />
        <div style={{minWidth: '35px', display: 'inline-block'}}>{this.state.translation}</div>
        <input
          type='range'
          min='-500'
          max='500'
          value={this.state.translation}
          onChange={this.handleTranslationChange}
        />
        <Board cols={cols} p={this.state.perspective} t={this.state.translation}>
          {Lazy(this.state.assemblers).map(a => (
            <Assembler
              key={a.id}
              assembler={a}
            />
          )).toArray()}
          {Lazy(this.state.crucibles).map(c => (
            <Crucible
              key={c.id}
              crucible={c}
              grid-area='crucibles'
            />
          )).toArray()}
          {Lazy(this.state.generators).map(g => (
            <Generator
              key={g.id}
              generator={g}
              grid-area='generators'
            />
          )).toArray()}
        </Board>
      </Box>
    )
  }
}
