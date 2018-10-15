import React from 'react';
import styled from 'styled-components';
import Lazy from 'lazy.js';

import NumberControl from './NumberControl';

const Container = styled.div`
  height: 200px;
  display: flex;
  flex-direction: column;
  border: solid 1px black;
`;

export default props => (
  <Container>
    {Lazy(props.demand)
      .map((amt, unitType, i) => (
        <NumberControl
          key={unitType+i}
          label={unitType}
          amt={amt}
          set={amt => props.setDemand(unitType, amt)}
        />
        ))
      .toArray()
    }
  </Container>
);
