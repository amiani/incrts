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
    const resources = this.props.store.resources;
    return (
      <Container>
        <div>
          <ResourceInfo>Credits: {resources.credits.toFixed(0)}</ResourceInfo>
          <ResourceInfo>Fabric: {resources.fabric.toFixed(0)}</ResourceInfo>
          <ResourceInfo>Hardware: {resources.hardware.toFixed(0)}</ResourceInfo>
          <ResourceInfo>Energy: {resources.energy.toFixed(1)}</ResourceInfo>
          <ResourceInfo>Drain: {this.props.store.buildings.getBuildingsDrain()}</ResourceInfo>
          <ResourceInfo>Productivity: {(resources.productivity * 100).toFixed(0)}%</ResourceInfo>
        </div>
        <button onClick={this.props.store.buildings.buildFactory}>Build Factory</button>
        <button onClick={this.props.store.buildings.buildAssembler}>Build Assembler</button>
        <button onClick={this.props.store.buildings.buildGenerator}>Build Generator</button>
      </Container>
    );
  }
}
