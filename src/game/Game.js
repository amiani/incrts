import React from 'react';
import styled from 'styled-components';

//import { GameContext } from './gameContext'
import Sidebar from './Sidebar'
import Base from './Base'
import Battlefield from './Battlefield'

import { TICKRATE } from './constants'

const GameGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 4fr 2fr;
  height: 100vh;
  width: 100vw;
`;

export default class Game extends React.Component {
  constructor() {
    super();
    setInterval(this.tickUpdate, TICKRATE);
  }

  initialize = () => {
  }

  tickUpdate = () => {
    this.props.gameState.resources.update();
    this.props.gameState.buildings.update();
  }

  render() {
    return (
      <GameGrid>
        <Sidebar gameState={this.props.gameState} />
        <Base gameState={this.props.gameState} />
        <Battlefield gameState={this.props.gameState} />
      </GameGrid>
    );
  }
}
