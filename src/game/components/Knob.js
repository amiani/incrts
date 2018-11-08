import React from 'react'

import broker from '../broker'

export default class Knob extends React.Component {
  state = { isDown: false }
  constructor(props) {
    super()
    this.canvas = React.createRef()
  }

  draw() {
    const ctx = this.canvas.current.getContext('2d')
    const { size } = this.props
    const center = size/2
    const radius = .4*size
    const lineWidth = .2*radius
    ctx.clearRect(0, 0, size, size)
    
    ctx.beginPath()
    ctx.arc(center, center, radius, 3/4*Math.PI, Math.PI/4)
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = 'grey'
    ctx.stroke()

    ctx.beginPath()
    const angle = 3*Math.PI/4*(this.props.value/50 + 1)
    ctx.arc(center, center, radius, 3/4*Math.PI, angle)
    ctx.lineWidth = lineWidth
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

  handleWheel = event => this.props.handleChange(event.deltaY < 0 ? 10 : -10)

  handleMouseDown = event => {
    this.startPosition = event.screenY;
    document.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('mouseup', this.handleMouseUp)
  }
  handleMouseUp = () => {
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mouseup', this.handleMouseUp)
  }
  handleMouseMove = event => {
    const amt = this.startPosition - event.screenY
    this.props.handleChange(amt)
    this.startPosition = event.screenY
  }

  render() {
    return <canvas
      ref={this.canvas}
      width={this.props.size}
      height={this.props.size}
      onWheel={this.handleWheel}
      onMouseDown={this.handleMouseDown}
    />
  }
}
