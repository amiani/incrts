import React from 'react';
import styled from 'styled-components';

import { assemblerSize } from './pieces/Assembler';
import { factorySize } from './pieces/Factory';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const FactoryRow = styled.div`
  display: flex;
  height: ${factorySize.height};
  margin-bottom: 10px;
`;

const AssemblerRow = styled.div`
  display: flex;
  height: ${assemblerSize.height};
`;

export default class Base extends React.Component {
  render() {
    return (
      <Container>
        <FactoryRow>
          {this.props.gameState.buildings.factories.map(f=>f.getComponent())}
        </FactoryRow>
        <AssemblerRow>
          {this.props.gameState.buildings.assemblers.map(f=>f.getComponent())}
        </AssemblerRow>
      </Container>
    );
  }
}
