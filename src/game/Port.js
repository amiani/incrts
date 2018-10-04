import React from 'react';
import uuidv4 from 'uuid/v4';
import styled from 'styled-components';

import DemandControl from './pieces/components/Hangar/DemandControl';
import { ExpandingHangar } from './pieces/components/Hangar';

const Container = styled.div`
  height: 200px;
  border: solid black 1px;
  background-color: #e6f3f7;
  display: flex;

`;

export default class Port extends React.Component {
  dispatch = () => {
    this.props.store.dispatch(this.id); 
  }

  setDemand = (unitType, demand) => {
    this.props.store.setDemand(this.props.hangar.id, unitType, demand);
  }

  render() {
    return (
      <Container>
        <button onClick={this.dispatch}>Dispatch</button>
        <ExpandingHangar
          height={150}
          width={150}
          hangar={this.props.hangar}
        />
        <DemandControl
          demand={this.props.hangar.demand}
          setDemand={this.setDemand}
        />
      </Container>
    );
  }
}
