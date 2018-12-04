import React from 'react'
import styled from 'styled-components'
import Lazy from 'lazy.js'

import broker from './broker'
import { ProtoCrucible, ProtoAssembler, ProtoGenerator, appWidth } from './pieces/prototypes'
import Assembler from './pieces/Assembler'
import Crucible from './pieces/Crucible'
import Generator from './pieces/Generator'
import { BOARDANGLE } from './constants'
import Market from './pieces/Market'
import TransferList from './pieces/TransferList'

const Box = styled.div`
  padding: 10px;
  width: 100%;
  background-color: #1e3145;
  color: white;
  perspective: 1000px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  transform-style: preserve-3d;
`

const Board = styled.div`
  display: grid;
  justify-content: center;
  transform-origin: bottom;
  transform: rotate3d(1, 0, 0, ${BOARDANGLE}rad);
  transform-style: preserve-3d;
  grid:
    ${ProtoGenerator.height}vh
    ${ProtoCrucible.height}vh
    ${ProtoAssembler.height}vh /
    ${p => (appWidth+'px ').repeat(p.cols)};
`

export default class Base extends React.Component {
  state = {
    assemblers: {},
    crucibles: {},
    generators: {},
    orders: {},

    value: 0,
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
    const cols = 1 + Math.max(
      Object.keys(this.state.assemblers).length,
      Object.keys(this.state.crucibles).length,
      Object.keys(this.state.generators).length,
    )
    return (
      <Box>
        <Board cols={cols} angle={BOARDANGLE}>
          {Lazy(this.state.generators).map(g => (
            <Generator
              key={g.id}
              generator={g}
              grid-area='generators'
            />
          )).toArray()}
          {Lazy(this.state.crucibles).map(c => (
            <Crucible
              key={c.id}
              crucible={c}
              grid-area='crucibles'
            />
          )).toArray()}
          <Market />
          {Lazy(this.state.assemblers).map(a => (
            <Assembler
              key={a.id}
              id={a.id}
            />
          )).toArray()}
          <TransferList />
        </Board>
      </Box>
    )
  }
}
