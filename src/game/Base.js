import React from 'react'
import styled from 'styled-components'
import Lazy from 'lazy.js'

import broker from './broker'
import { ProtoCrucible, ProtoAssembler, ProtoPreaccelerator, appWidth } from './pieces/prototypes'
import Assembler from './pieces/Assembler'
import Crucible from './pieces/Crucible'
import Preaccelerator from './pieces/Preaccelerator'
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
    ${ProtoPreaccelerator.height}vh
    ${ProtoCrucible.height}vh
    ${ProtoAssembler.height}vh /
    ${p => (appWidth+'px ').repeat(p.cols)};
`

export default class Base extends React.Component {
  state = {
    assemblers: {},
    crucibles: {},
    preaccelerators: {},
    orders: {},

    value: 0,
  }

  constructor() {
    super()
    broker.addListener('apparati', 'Base', body => this.setState(body))
  }


  handlePerspectiveChange = event => this.setState({ perspective: event.target.value })

  handleTranslationChange = event => this.setState({ translation: event.target.value })

  render() {
    const cols = 1 + Math.max(
      Object.keys(this.state.assemblers).length,
      Object.keys(this.state.crucibles).length,
      Object.keys(this.state.preaccelerators).length,
    )
    return (
      <Box>
        <Board cols={cols} angle={BOARDANGLE}>
          {Lazy(this.state.preaccelerators).map(g => (
            <Preaccelerator
              key={g.id}
              preaccelerator={g}
              grid-area='preaccelerators'
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
