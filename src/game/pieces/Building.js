import React from 'react';
import styled from 'styled-components';

import Button from './components/Button.js';

const Container = styled.div`
  width: ${p=>p.width}px;
  height: ${p=>p.height}px;
  border: solid black 1px;
  margin-left: 5px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${p => p.color};
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
`;

const MessageBox = styled.div`
  color: red;
  height: 10px;
  font-size: 10px;
  opacity: 1;
  @keyframes flash {
    0% { opacity: 0 }
    50% { opacity: 1 }
    100% { opacity: 0 }
  }
`;

export default class Building extends React.Component {
  state = {
    flipped: false,
  }

  flip = () => this.setState((prevState, _) => ({ flipped: !prevState.flipped }))

  render() {
    return (
      <Container {...this.props} color={this.state.flipped ? '#fff2f4' : '#eafeea'}>
        <Header>
          <Button onClick={this.flip}>Flip</Button>
        </Header>
        {this.state.flipped ? this.props.back : this.props.front}
        <MessageBox>{this.props.message}</MessageBox>
      </Container>
    );
  }
}

export const Front = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const Back = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;
