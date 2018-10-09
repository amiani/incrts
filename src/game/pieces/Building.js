import React from 'react';
import styled from 'styled-components';

import Button from './components/Button.js';

const Container = styled.div`
  width: ${p=>p.width}px;
  height: ${p=>p.height}px;
  margin-left: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${p => p.color};

  perspective: 1000px;
`;

const Header = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-direction: row;
  border: solid black 2px;
  padding: 1px;
  margin-bottom: 2px;
`;

const Flipper = styled.div`
  transform-style: preserve-3d;
  height: 100%;
`;

const MessageBox = styled.div`
  color: red;
  height: 10px;
  flex-shrink: 0;
  font-size: 10px;
  opacity: 1;
  @keyframes flash {
    0% { opacity: 0 }
    50% { opacity: 1 }
    100% { opacity: 0 }
  }
`;

const Front = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  transform: rotateY(${p => p.flipped ? 180 : 0}deg);
  transition: transform ease 500ms;
  border: black solid 2px;
  padding: 2px;
  background: linear-gradient(to bottom right, #eafeea, white);
  box-shadow: 2px 2px 1px 0px;
`;

const Back = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  transform: rotateY(${p => p.flipped ? 0 : -180}deg);
  transition: transform ease 500ms;
  border: black solid 2px;
  padding: 2px;
  background: linear-gradient(#fff2f4, white);
  box-shadow: 2px 2px 2px 0px;
`;

export default class Building extends React.Component {
  state = {
    flipped: false,
  }

  flip = () => this.setState((prevState, _) => ({ flipped: !prevState.flipped }))

  render() {
    return (
      <Container {...this.props} color={this.state.flipped ? '' : ''}>
        <Header>
          <Button onClick={this.flip}>Flip</Button>
        </Header>
        <Flipper>
          <Front flipped={this.state.flipped}>
            {this.props.front}
          </Front>
          <Back flipped={this.state.flipped}>
            {this.props.back}
          </Back>
        </Flipper>
        <MessageBox>{this.props.message}</MessageBox>
      </Container>
    );
  }
}
