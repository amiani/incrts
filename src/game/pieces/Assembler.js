import React from 'react';

import Building, { Front, Back } from './Building';
import BuildQueue from './components/BuildQueue';
import { hardwareData } from './resources';
import Button from './components/Button';

export const assemblerData = {
  type: 'assemblers',
  name: 'assembler',
  cost: { credits: 50, fabric: 50 },
  drain: 1,
  width: 200,
  height: 250,
};

export default class Assembler extends React.Component {
  constructor(props) {
    super();
    this.id = props.data.id;
  }

  state = { message: '' }

  addProgress = () => {
    this.props.store.addProgress(this.id, 50*this.props.store.productivity)
      .catch(error => this.setState({ message: error }));
  }

  enqueueHardware = () => {
    this.props.store.enqueue(this.id, new hardwareData())
      .catch(error => this.setState({ message: error }));
  }

  render() {
    return (
      <Building 
        width={assemblerData.width}
        height={assemblerData.height}
        message={this.state.message}
        front={
          <Front>
            <BuildQueue
              items={this.props.buildQueue.items}
              progress={this.props.buildQueue.progress}
            />
            <Button onClick={this.addProgress}>Assemble</Button>
            <Button onClick={this.enqueueHardware}>Hardware</Button>
          </Front>
        }
      />
    );
  }
}
