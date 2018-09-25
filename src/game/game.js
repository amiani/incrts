import React from 'react';
import styled from 'styled-components';

import { GameContext } from './gameContext'
import Sidebar from './sidebar'
import Base from './base'
import Battlefield from './battlefield'

const GameGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 4fr 2fr;
  height: 100vh;
  width: 100vw;
`;

export default class Game extends React.Component {
  constructor() {
    super();
    //this.initialize();
    setInterval(this.update, 100);
  }

  initialize = () => {
  }

  update = () => {

  }

  render() {
    return (
      <GameContext.Consumer>
        {gameState => {
          console.log('gameState: ', gameState);
          return (
            <GameGrid>
              <Sidebar gameState={gameState} />
              <Base />
              <Battlefield />
            </GameGrid>
          );
        }}
      </GameContext.Consumer>
    );
  }
}
