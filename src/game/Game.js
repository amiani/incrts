import React from 'react';
import styled from 'styled-components';
import Lazy from 'lazy.js';

import Sidebar from './Sidebar'
import Base from './Base'
import Battlefield from './Battlefield'

import { TICKRATE } from './constants'

const GameGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 4fr 2fr;
  --pad: 5px;
  padding: var(--pad);
  height: calc(100vh - 2*var(--pad));
  width: calc(100vw - 2*var(--pad));
`;

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.initialize();
    setInterval(this.tickUpdate, TICKRATE);
  }

  initialize = () => {
    this.props.store.makeBattlefield();
    this.props.store.buildGenerator();
    this.props.store.buildFactory();
  }

  tickUpdate = () => {
    this.props.store.updateResources();
    this.props.store.updateBuildings();
    this.props.store.updateBuildQueues();
    this.props.store.updateHangars();
  }

  render() {
    return (
      <GameGrid>
        <Sidebar store={this.props.store} />
        <Base />
        {Lazy(this.props.store.battlefields).map(bf => (
          <Battlefield
            key={bf.id}
            battlefield={bf}
            store={this.props.store}
          />
        )).toArray()}
      </GameGrid>
    );
  }
}
