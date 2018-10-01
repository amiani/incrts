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
  constructor(props) {
    super(props);
    this.initialize();
    setInterval(this.tickUpdate, TICKRATE);
  }

  initialize = () => {
    this.props.store.buildGenerator();
  }

  tickUpdate = () => {
    this.props.store.updateResources();
    this.props.store.updateBuildings();
  }

  render() {
    return (
      <GameGrid>
        <Sidebar store={this.props.store} />
        <Base />
        <Battlefield store={this.props.store} />
      </GameGrid>
    );
  }
}
