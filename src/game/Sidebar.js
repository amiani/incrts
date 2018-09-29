import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const ResourceInfo = styled.p`
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

export default class Sidebar extends React.Component {
  /*
  shouldComponentUpdate(nextProps, nextState) {
    console.log('this.props', this.props);
    console.log('nextProps', nextProps);
  }*/

  render() {
    const store = this.props.store;
    return (
      <Container>
        <div>
          <ResourceInfo>Credits: {store.credits.toFixed(0)}</ResourceInfo>
          <ResourceInfo>Fabric: {store.fabric.toFixed(0)}</ResourceInfo>
          <ResourceInfo>Hardware: {store.hardware.toFixed(0)}</ResourceInfo>
          <ResourceInfo>Energy: {store.energy.toFixed(1)}</ResourceInfo>
          <ResourceInfo>Drain: {store.getBuildingsDrain()}</ResourceInfo>
          <ResourceInfo>Productivity: {(store.productivity * 100).toFixed(0)}%</ResourceInfo>
        </div>
        <button onClick={store.buildFactory}>Build Factory</button>
        <button onClick={store.buildAssembler}>Build Assembler</button>
        <button onClick={store.buildGenerator}>Build Generator</button>
      </Container>
    );
  }
}
