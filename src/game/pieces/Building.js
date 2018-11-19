import React from 'react'
import styled from 'styled-components'

import { BOARDANGLE } from '../constants'
import Button from '../components/Button.js'
import MessageBox from '../components/MessageBox'

const Box = styled.div`
  width: ${p=>p.width}px;
  height: ${p=>p.height}px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  perspective: 1000px;
  transform-style: preserve-3d;
`

const Header = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-direction: row;
  border: solid black 2px;
  padding: 1px;
  margin-bottom: 2px;
`

const HOVERDIST = 20;
const Flipper = styled.div`
  height: 100%;
  transform-style: preserve-3d;
  :hover {
    transform: translate3d(
      0, 
      ${HOVERDIST*Math.asin(BOARDANGLE)}px, 
      ${HOVERDIST*Math.acos(BOARDANGLE)}px
    );
  }
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
  transition: transform ease 500ms;
  border: solid #ee855e 2px;
  padding: 2px;
  //box-shadow: 2px 2px 1px 0px;

`

const Front = styled(Face)`
  z-index: 3;
  transform: rotateY(${p => p.flipped ? 180 : 0}deg);
  ::before {
    //background-color: #ee855e;
    backdrop-filter: blur(5px);
    display: block;
    content: ' ';
    opacity: .25;
    z-index: -1;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
`

const Back = styled(Face)`
  z-index: 2;
  transform: rotateY(${p => p.flipped ? 0 : -180}deg);
`

export default class Building extends React.Component {
  state = {
    flipped: false,
  }

  flip = () => this.setState((prevState, _) => ({ flipped: !prevState.flipped }))

  handleMouseUp = e => {
    e.button === 1 && this.flip()
  }

  render() {
    const head = (
      <Header>
        <Button onClick={this.flip}>Flip</Button>
        {this.props.showSider &&
          <Button onClick={this.props.showSider}>Recipes</Button>
        }
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
