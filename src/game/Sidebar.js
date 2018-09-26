import React from 'react';
import styled from 'styled-components';

export default class Sidebar extends React.Component {
  /*
  shouldComponentUpdate(nextProps, nextState) {
    console.log('this.props', this.props);
    console.log('nextProps', nextProps);
  }*/

  render() {
    return (
      <div>
        <div>
          <p>Sidebar</p>
          <p>Credits: {this.props.gameState.resources.credits.toFixed(0)}</p>
          <p>Fabric: {this.props.gameState.resources.fabric.toFixed(0)}</p>
          <p>Energy: {this.props.gameState.resources.energy.toFixed(1)}</p>
        </div>
        <button onClick={this.props.gameState.buildings.buildFactory}>Build Factory</button>
        <button onClick={this.props.gameState.buildings.buildAssembler}>Build Assembler</button>
      </div>
    );
  }
}
