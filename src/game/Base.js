import React from 'react';

export default class Base extends React.Component {
  render() {
    return (
      <div>
        <p>{this.props.gameState.buildings.factories.map(f =>f.toString())}</p>
        <p>{this.props.gameState.buildings.assemblers.map(f =>f.toString())}</p>
      </div>
    );
  }
}
