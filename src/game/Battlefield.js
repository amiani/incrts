import React from 'react';
import uuidv4 from 'uuid/v4';
import styled from 'styled-components';

import Port from './Port';

export function battlefieldData(portId) {
  this.id = uuidv4();
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
          id={this.props.store.ports[this.props.id].id}
          store={this.props.store}
          hangar={this.props.store.hangars[this.props.id]}
        />
      </Container>
    );
  }
}
