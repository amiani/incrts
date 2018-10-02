import React from 'react';
//import styled from 'styled-components';

import Building from './Building';
import BuildQueue from './components/BuildQueue';
import { tankData } from './units';

export const factoryData = {
  type: 'factories',
  name: 'factory',
  cost: { credits: 50, fabric: 50 },
  drain: 1,
  width: 200,
  height: 300,
};

export default class Factory extends React.Component {
  constructor(props) {
    super();
    this.id = props.data.id;
  }

  enqueueTank = async () => {
    try {
      await this.props.store.enqueue(this.id, new tankData());
    }
    catch(error) {
      console.log(error);
    }
  }

  render() {
    return (
      <Building
        width={factoryData.width}
        height={factoryData.height}
        front={
          <div>
            <BuildQueue
              items={this.props.buildQueue.items}
              progress={this.props.buildQueue.progress}
            />
            <button onClick={this.enqueueTank}>Tank</button>
          </div>
        }
      />
    );
  }
}
