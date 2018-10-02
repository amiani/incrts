import React from 'react';
import uuidv4 from 'uuid/v4';
import styled from 'styled-components';

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
      </Container>
    );
  }
}
