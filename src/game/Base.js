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
  //background-color: #221d31;
  background-color: #1e3145;
  color: white;
  perspective: 1000px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const Board = styled.div`
  display: grid;
  justify-content: center;
  transform:
    translate3d(0, ${p => -p.t*Math.acos(p.angle)}px, ${p => -p.t*Math.asin(p.angle)}px)
    rotate3d(1, 0, 0, ${p=>p.angle}rad)
  ;
  transform-style: preserve-3d;
  grid:
    ${ProtoGenerator.height}px
    ${ProtoCrucible.height}px
    ${ProtoAssembler.height}px /
    ${p => '250px '.repeat(p.cols)}
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
      'apparati',
      { id: 'Base', onmessage: body => this.setState(body) }
    )
    broker.addListener(
      'apparatus',
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
        <Board cols={cols} angle={Math.PI/4} t={this.state.translation}>
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
