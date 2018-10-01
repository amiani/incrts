import React from 'react';
import uuidv4 from 'uuid/v4';
//import styled from 'styled-components';

import { GameContext } from '../gameContext';
import Building from './Building';
import BuildQueue from '../components/BuildQueue';

export const assemblerData = {
  type: 'assemblers',
  name: 'assembler',
  cost: { credits: 50, fabric: 50 },
  drain: 1,
  width: 200,
  height: 250,
};

export default class Assembler extends React.Component {
  addProgress = () => {
    console.log('addProgress');
    this.props.store.addProgress(this.props.data.id, 50*this.props.store.productivity)
  }

  render() {
    return (
      <Building 
        width={assemblerData.width}
        height={assemblerData.height}
        front={
          <div>
            <BuildQueue
              queue={this.props.buildQueue.queue}
              progress={this.props.buildQueue.progress}
            />
            <button onClick={this.addProgress}>Assemble</button>
          </div>
        }
      />
    );
  }
}
