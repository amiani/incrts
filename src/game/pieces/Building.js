import React from 'react'
import styled from 'styled-components'

import Button from '../components/Button.js'
import MessageBox from '../components/MessageBox'

const Box = styled.div`
  width: ${p=>p.width}px;
  height: ${p=>p.height}px;
  margin-left: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${p => p.color};
  perspective: 1000px;
`

const Header = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-direction: row;
  border: solid black 2px;
  padding: 1px;
  margin-bottom: 2px;
`

const Flipper = styled.div`
  transform-style: preserve-3d;
  height: 100%;
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
  border: black solid 2px;
  padding: 2px;
  box-shadow: 2px 2px 1px 0px;
`

const Front = styled(Face)`
  z-index: 2;
  transform: rotateY(${p => p.flipped ? 180 : 0}deg);
  background: linear-gradient(to bottom right, #eafeea, white);
`

const Back = styled(Face)`
  transform: rotateY(${p => p.flipped ? 0 : -180}deg);
  background: linear-gradient(#fff2f4, white);
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
    return (
      <Box {...this.props} onMouseUp={this.handleMouseUp}>
        <Header>
          <Button onClick={this.flip}>Flip</Button>
          {this.props.showSider &&
            <Button onClick={this.props.showSider}>Show Sider</Button>
          }
        </Header>
        <Flipper>
          <Front flipped={this.state.flipped}>
            {this.props.front}
          </Front>
          <Back flipped={this.state.flipped}>
            {this.props.back}
          </Back>
        </Flipper>
        <MessageBox message={this.props.message} />
      </Box>
    )
  }
}
