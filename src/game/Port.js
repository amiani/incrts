import React from 'react';
import styled from 'styled-components';

import DemandControl from './components/Hangar/DemandControl';
import { ExpandingHangar } from './components/Hangar';
import Button from './components/Button';

const Box = styled.div`
  height: 200px;
  border: solid black 1px;
  background-color: #e6f3f7;
  display: flex;

`;

export default class Port extends React.Component {
  dispatch = () => {
    this.props.store.dispatch(this.props.hangar.id);
  }

  setDemand = (unitType, amt) => {
    this.props.store.setDemand(this.props.hangar.id, unitType, amt);
  }

  render() {
    return (
      <Box>
        <Button onClick={this.dispatch}>Dispatch</Button>
        <ExpandingHangar
          id={this.props.hangar.id}
          height={150}
          width={150}
          hangar={this.props.hangar}
        />
        <DemandControl
          demand={this.props.hangar.demand}
          setDemand={this.setDemand}
        />
      </Box>
    );
  }
}
