import React from 'react'

import broker from '../broker'

export default class Knob extends React.Component {
  state = { active: false }
  constructor(props) {
    super()
    this.canvas = React.createRef()
  }

  draw() {
    const ctx = this.canvas.current.getContext('2d')
    const { size, value, max, min } = this.props
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
    const angle = 3*Math.PI/2*( value/(max - min) + 1/2 )
    ctx.arc(center, center, radius, 3/4*Math.PI, angle)
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = this.state.active ? 'white' : '#d7c844'
    ctx.stroke()

    ctx.beginPath()
    const x = (radius-5)*Math.cos(angle) + size/2
    const y = (radius-5)*Math.sin(angle) + size/2
    ctx.arc(x, y, 2, 0, 2*Math.PI)
    ctx.fillStyle = 'white'
    ctx.fill()

    ctx.font = `${size/4}px Rubik`
    ctx.fillStyle = '#d7c844'
    ctx.textAlign = 'center'
    ctx.textBaseLine = 'middle'
    ctx.fillText(Math.round(value), center, center + size/20)
  }

  componentDidMount() {
    this.draw()
  }

  componentDidUpdate() {
    this.draw()
  }

  handleWheel = event => this.props.handleChange(event.deltaY < 0 ? this.props.step : -this.props.step)

  handleMouseDown = event => {
    if (event.button === 0) {
      this.setState({ active: true })
      this.startPosition = event.clientY;
      document.body.style['pointer-events'] = 'none'
      document.addEventListener('mousemove', this.handleMouseMove)
      document.addEventListener('mouseup', this.handleMouseUp)
    }
  }
  handleMouseUp = () => {
    this.setState({ active: false })
    document.body.style['pointer-events'] = 'auto'
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mouseup', this.handleMouseUp)
    this.props.toggleTuning && this.props.toggleTuning()
  }
  handleMouseMove = event => {
    const amt = Math.round((15*(this.startPosition - event.clientY)/window.innerHeight)*(this.props.max-this.props.min))
    this.props.handleChange(amt)
    this.startPosition = event.clientY
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
