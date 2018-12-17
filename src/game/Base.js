import React from 'react'
import styled from 'styled-components'
import Lazy from 'lazy.js'

import broker from './broker'
import { ProtoCrucible, ProtoAssembler, ProtoPreaccelerator, appWidth } from './pieces/prototypes'
import Assembler from './pieces/Assembler'
import Crucible from './pieces/Crucible'
import Preaccelerator from './pieces/Preaccelerator'
import { BOARDANGLE, BOARDDIST, MODHEIGHT, PERSPECTIVE } from './constants'
import Market from './pieces/Market'
import TransferList from './pieces/TransferList'
import Smasher from './pieces/Smasher'

const Box = styled.div`
  width: 100%;
  background-color: #1e3145;
  color: white;
  perspective: ${PERSPECTIVE}vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  transform-style: preserve-3d;
`

const Board = styled.div`
  height: 132vh;
  position: relative;
  top: 17.5vh;
  flex-shrink: 0;
  transform: translate3d(0, 0, ${-BOARDDIST}vh);
  transform-style: preserve-3d;
`

const Row = styled.div`
  display: flex;
  height: ${p => p.height}%;
  & > * {
    flex-shrink: 0;
  }
`

const Rotator = styled.div`
  transform-origin: top;
  transform-style: preserve-3d;
  transform: rotate3d(1, 0, 0, ${Math.PI/12}rad);
  height: ${p=>p.height}%;
`

const PreacceleratorMod = styled.div`
  grid-row: 3;
  border: solid #ee855e 2px;
  rotate3d(1, 0, 0, ${-BOARDANGLE/3}rad);
  height: 100%;
  width: 420px;
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
      Object.keys(this.state.preaccelerators).length,
    )
    return (
      <Box>
        <Board>
          <Row height={100/3}>
            {Lazy(this.state.assemblers).map(a => (
              <Assembler
                key={a.id}
                id={a.id}
              />
            )).toArray()}
            <TransferList />
          </Row>
          <Rotator height={200/3}>
            <Row height={100/3}>
              <Market />
            </Row>
            <Rotator height={200/3}>
              <Row height={25}>
                <PreacceleratorMod />
              </Row>
              <Rotator height={75}>
                <Row height={100}>
                  {Lazy(this.state.preaccelerators).map(g => (
                    <Preaccelerator
                      key={g.id}
                      preaccelerator={g}
                      grid-area='preaccelerators'
                    />
                  )).toArray()}
                </Row>
              </Rotator>
            </Rotator>
          </Rotator>
        </Board>
        <Smasher />
      </Box>
    )
  }
}
