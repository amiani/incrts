import React from 'react'
import styled from 'styled-components'
import Lazy from 'lazy.js'

import { colorDict } from '../../pieces/units'
import DemandControl from './DemandControl'
import broker from '../../broker'

const EDGELENGTH = 5
const PADDING = 5

const Box = styled.div`
  height: 100%;
  width: ${p => p.width}px;
  padding: ${PADDING}px;
  display: flex;
`

class DotGrid extends React.Component {
  constructor(props) {
    super()
    this.canvas = React.createRef()
    this.numCols = Math.floor(props.width / (EDGELENGTH + 2))
  }

  componentDidUpdate() {
    const ctx = this.canvas.current.getContext('2d')
    ctx.clearRect(0, 0, this.canvas.current.height, this.canvas.current.width)

    let color, x, y
    for (let i = 0, n = this.props.dots.length; i < n; i++) {
      color = this.props.dots[i]
      x = i % this.numCols
      y = Math.floor(i / this.numCols)
      ctx.fillStyle = color
      ctx.fillRect(x*(EDGELENGTH+2), y*(EDGELENGTH+2), EDGELENGTH, EDGELENGTH)
    }
  }

  render() {
    return <canvas ref={this.canvas} width={this.props.width} height={this.props.height}/>
  }
}

export default class ExpandingBuffer extends React.Component {
  state = {
    units: {},
    expanded: false,
  }

  constructor(props) {
    super()
    props.id = props.id
    broker.addListener('update', props.id, this.handleMessage)
  }

  handleMessage = body => {
    body.buffers[props.id] && this.setState(body.buffers[props.id])
  }
  
  setDemand = (unitType, amt) => {
    broker.post({
      sub: 'setDemand',
      body: {
        bufferId: props.id,
        unitType,
        amt
      }
    })
  }

  render() {
    if (this.state.expanded) {
      return <p>Expanded!</p>
    } else {
      return (
        <Box width={this.props.width}>
          {this.props.withControl &&
            <DemandControl
              demand={this.state.demand}
              setDemand={this.setDemand}
            />
          }
          <DotGrid 
            width={this.props.width - 2*PADDING - (this.props.withControl ? 80 : 0)}
            height={this.props.height}
            dots={Lazy(this.state.units)
              .values()
              .flatten(true)
              .map(u => colorDict[u.type])
              .toArray()
            }
          />
        </Box>
      )
    }
  }
}
