import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: ${p=>p.width}px;
  height: ${p=>p.height}px;
  border: solid black 1px;
  margin: 0 5px 0 5px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  background-color: ${p => p.color};
`;

export default class Building extends React.Component {
  state = { flipped: false }

  flip = () => this.setState((prevState, _) => ({ flipped: !prevState.flipped }))

  render() {
    return (
      <Container {...this.props} color={this.state.flipped ? '#fff2f4' : '#eafeea'}>
        <button onClick={this.flip}>Flip</button>
        {this.state.flipped ? this.props.back : this.props.front}
      </Container>
    );
  }
}
