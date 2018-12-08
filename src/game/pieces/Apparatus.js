import React from 'react'
import styled from 'styled-components'

import { BOARDANGLE } from '../constants'
import Button from '../components/Button.js'
import MessageBox from '../components/MessageBox'

const Box = styled.div`
  width: ${p=>p.width}px;
  height: ${p=>p.height}vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transform-style: preserve-3d;
`

const Header = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-direction: row;
  padding: 1px;
  margin-bottom: 2px;
  align-items: center;
`

const Flipper = styled.div`
  height: 100%;
  transform-style: preserve-3d;
`

const Face = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  transition: transform ease 500ms, opacity 20ms 240ms;
  border: solid #ee855e 2px;
  background-color: rgba(238, 133, 93, .025);
  padding: 2px;
  :hover {
    border: solid rgba(238, 133, 94, .25) 2px;
  }
`

const Front = styled(Face)`
  z-index: ${p => p.flipped ? 3 : 2};
  transform: rotateY(${p => p.flipped ? 180 : 0}deg);
  opacity: ${p => p.flipped ? 0 : 1};
  ${Flipper}:hover & {
    ::before {
      //background-color: rgba(30, 49, 69, .9);
      @supports ((-webkit-backdrop-filter: blur(5px)) or (backdrop-filter: blur(5px))) {
        //background-color: #ee855e;
        backdrop-filter: blur(5px);
        opacity: .5;
      }
      display: block;
      content: ' ';
      z-index: -1;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
  }
`

const Back = styled(Face)`
  z-index: ${p => p.flipped ? 2 : 3};
  transform: rotateY(${p => p.flipped ? 0 : -180}deg);
  opacity: ${p => p.flipped ? 1 : 0};
`

export default class Apparatus extends React.Component {
  state = {
    flipped: false,
  }

  flip = () => this.setState((prevState, _) => ({ flipped: !prevState.flipped }))

  handleMouseUp = e => {
    this.props.flippable && e.button === 1 && this.flip()
  }

  render() {
    const head = (
      <Header>
        {this.props.flippable && <Button onClick={this.flip}>{this.state.flipped ? 'Controls' : 'Upgrades'}</Button>}
        {this.props.header}
      </Header>
    )
    return (
      <Box {...this.props} onMouseUp={this.handleMouseUp}>
        <Flipper>
          <Front flipped={this.state.flipped}>
            {head}
            {this.props.front}
          </Front>
          <Back flipped={this.state.flipped}>
            {head}
            {this.props.back}
          </Back>
        </Flipper>
        <MessageBox message={this.props.message} />
      </Box>
    )
  }
}
