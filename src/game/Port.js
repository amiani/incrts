import React from 'react';
import uuidv4 from 'uuid/v4';
import styled from 'styled-components';

import { ExpandingHangar } from './pieces/components/Hangar';

export function portData(battlefieldId) {
  this.id = uuidv4();
  this.battlefieldId = battlefieldId;
};

const Container = styled.div`
  height: 200px;
  border: solid black 1px;
  background-color: #e6f3f7;
`;

export default class Port extends React.Component {
  render() {
    return (
      <Container>
        Port
        <ExpandingHangar
          height={200}
          width={200}
          hangar={this.props.hangar}
        />
      </Container>
    );
  }
}
