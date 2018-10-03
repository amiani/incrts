import React from 'react';
import styled from 'styled-components';

import { factoryData } from '../../Factory';
import { colorDict } from '../../units';

const EDGELENGTH = 5;

const Container = styled.div`
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

  render() {
    const numCols = Math.floor(this.props.width / (EDGELENGTH + 2));
    console.log(numCols);
    if (this.state.expanded) {
      return <p>Expanded!</p>;
    } else {
      return (
        <Container height={this.props.height} width={this.props.width}>
          <DotGrid numCols={numCols}>
            {this.props.hangar.units.map(u => <Dot color={colorDict[u.type]} />)}
          </DotGrid>
        </Container>
      );
    }
  }
}
