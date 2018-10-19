import React from 'react';
import styled from 'styled-components';
import Lazy from 'lazy.js';

import GameContext from '../../gameContext'
import { colorDict } from '../../pieces/units';

const EDGELENGTH = 5;

const Box = styled.div`
  height: ${p => p.height}px;
  width: ${p => p.width}px;
  padding: 5px;
`;

const Dot = styled.div`
  width: ${EDGELENGTH}px;
  height: ${EDGELENGTH}px;
  background-color: ${p => p.color};
  margin: 1px;
`;

const DotGrid = styled.div`
  display: grid;
  grid-template-columns: ${p => ` ${EDGELENGTH+2}px`.repeat(p.numCols)};
  width: 100%;
`;

export default class ExpandingHangar extends React.Component {
  state = { expanded: false }

  shouldComponentUpdate() { return false }

  render() {
    const numCols = Math.floor(this.props.width / (EDGELENGTH + 2));
    if (this.state.expanded) {
      return <p>Expanded!</p>;
    } else {
      return (
        <GameContext.Consumer>{({ hangars }) => (
          <Box height={this.props.height} width={this.props.width}>
            <DotGrid numCols={numCols}>
              {Lazy(hangars[this.props.id].units)
                .values()
                .flatten(true)
                .map(u => <Dot key={u.id} color={colorDict[u.type]} />)
                .toArray()
              }
            </DotGrid>
          </Box>
        )}</GameContext.Consumer>
      );
    }
  }
}
