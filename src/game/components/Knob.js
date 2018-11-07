import React from 'react'

import broker from '../broker'

export default class Knob extends React.Component {
  constructor(props) {
    super()
    this.canvas = React.createRef()
  }

  draw() {
    const ctx = this.canvas.current.getContext('2d')
    const { size } = this.props
    const center = size/2
    const radius = .4*size
    ctx.clearRect(0, 0, size, size)
    ctx.beginPath()
    ctx.arc(center, center, radius, 5/4*Math.PI, -Math.PI/4)
    ctx.lineWidth = Math.round(.5*radius)
    ctx.strokeStyle = 'yellow'
    ctx.stroke()

    ctx.font = '10px sans-serif'
    ctx.fillStyle = 'yellow'
    ctx.textAlign = 'center'
    ctx.textBaseLine = 'middle'
    ctx.fillText(this.props.value, center, center)
  }

  componentDidMount() {
    this.draw()
  }

  componentDidUpdate() {
    this.draw()
  }

  render() {
    return <canvas
      ref={this.canvas}
      width={this.props.size}
      height={this.props.size}
      onWheel={this.props.handleWheel}
    />
  }
}
