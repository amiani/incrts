import React from 'react';

import Building from './Building';
import BuildQueue from '../components/BuildQueue';
import { hardwareData } from './resources';

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

  addProgress = () => {
    this.props.store.addProgress(this.id, 50*this.props.store.productivity)
  }

  enqueueHardware = async () => {
    try {
      await this.props.store.enqueue(this.id, new hardwareData());
    }
    catch(error) {
      console.log(error);
    }
  }

  render() {
    return (
      <Building 
        width={assemblerData.width}
        height={assemblerData.height}
        front={
          <div>
            <BuildQueue
              items={this.props.buildQueue.items}
              progress={this.props.buildQueue.progress}
            />
            <button onClick={this.addProgress}>Assemble</button>
            <button onClick={this.enqueueHardware}>Hardware</button>
          </div>
        }
      />
    );
  }
}
