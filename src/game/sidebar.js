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
        <p>Sidebar</p>
        <p>Credits: {this.props.gameState.resources.credits}</p>
        <p>Fabric: {this.props.gameState.resources.fabric}</p>
        <p>Energy: {this.props.gameState.resources.energy}</p>
        <button onClick={this.props.gameState.addTrust}>Add Trust</button>
      </div>
    );
  }
}
