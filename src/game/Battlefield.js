import React from 'react';
import uuidv4 from 'uuid/v4';
import styled from 'styled-components';

import Port from './Port';

export function battlefieldData(hangarId) {
  this.id = uuidv4();
  this.hangarId = hangarId;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export default class Battlefield extends React.Component {
  render() {
    return (
      <Container>
        <div>Battlefield</div>
        <Port
          store={this.props.store}
          hangar={this.props.store.hangars[this.props.battlefield.hangarId]}
        />
      </Container>
    );
  }
}
