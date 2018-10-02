import React from 'react';
import styled from 'styled-components';

import Port from './pieces/Port';

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
        <Port />
      </Container>
    );
  }
}
