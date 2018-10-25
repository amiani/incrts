import React from 'react'
import styled from 'styled-components'
import Lazy from 'lazy.js'

import { colorDict } from '../../pieces/units'
import DemandControl from './DemandControl'
import broker from '../../broker'

const EDGELENGTH = 5

const Box = styled.div`
  height: 100%;
  width: ${p => p.width}px;
  padding: 5px;
  display: flex;
`

const Dot = styled.div`
  width: ${EDGELENGTH}px;
  height: ${EDGELENGTH}px;
  background-color: ${p => p.color};
  margin: 1px;
`

const DotGrid = styled.div`
  display: grid;
  grid-template-columns: ${p => ` ${EDGELENGTH+2}px`.repeat(p.numCols)};
`

export default class ExpandingHangar extends React.Component {
  state = {
    units: {},
    expanded: false,
  }

  constructor(props) {
    super()
    this.id = props.id
    broker.addListener(
      'update',
      { id: this.id, onmessage: this.onmessage }
    )
  }

  onmessage = body => {
    body.hangars[this.id] && this.setState(body.hangars[this.id])
  }
  
  setDemand = (unitType, amt) => {
    broker.post({
      sub: 'setdemand',
      body: {
        hangarId: this.id,
        unitType,
        amt
      }
    })
  }

  render() {
    const numCols = Math.floor(this.props.width / (EDGELENGTH + 2))
    if (this.state.expanded) {
      return <p>Expanded!</p>
    } else {
      return (
        <Box width={this.props.width}>
          {this.props.withControl ? (
            <DemandControl
              demand={this.state.demand}
              setDemand={this.setDemand}
            />
          ) : null}
          <DotGrid numCols={numCols}>
            {Lazy(this.state.units)
              .values()
              .flatten(true)
              .map(u => <Dot key={u.id} color={colorDict[u.type]} />)
              .toArray()
            }
          </DotGrid>
        </Box>
      )
    }
  }
}
