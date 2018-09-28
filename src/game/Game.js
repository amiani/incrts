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
    this.props.store.resources.update();
    this.props.store.buildings.update();
  }

  render() {
    return (
      <GameGrid>
        <Sidebar store={this.props.store} />
        <Base store={this.props.store} />
        <Battlefield store={this.props.store} />
      </GameGrid>
    );
  }
}
