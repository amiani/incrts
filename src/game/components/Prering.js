import React from 'react'

export default class Prering extends React.Component {
  constructor(props) {
    super()
    this.canvas = React.createRef()
  }

  componentDidMount() {
    requestAnimationFrame(this.draw)
    this.start = performance.now()
  }

  draw = now => {
    const timeDelta = now - this.start
    const ctx = this.canvas.current.getContext('2d')
    const { size }  = this.props
    const lineWidth = 25
    const radius = (size/2) - lineWidth/2
    ctx.clearRect(0, 0, size, size)

    ctx.beginPath()
    ctx.arc(size/2, size/2, radius, 0, 2*Math.PI)
    ctx.strokeStyle = 'white'
    ctx.lineWidth = lineWidth
    ctx.stroke()

    const bunchHead = Math.PI/3000 * timeDelta
    for (let i = 0, n = this.props.numParticles; i < n; i++) {
      const headOffset = i * Math.PI/16
      let radiusOffset = Math.floor((Math.random() - 0.5) * (lineWidth - 10))
      radiusOffset = 0  //was causing too much jiggling
      const x = (radius+radiusOffset)*Math.cos(bunchHead + headOffset)
      const y = (radius+radiusOffset)*Math.sin(bunchHead + headOffset)
      ctx.beginPath()
      ctx.arc(size/2 + x, size/2 - y, 3, 0, 2*Math.PI)
      ctx.fillStyle = 'black'
      ctx.fill()
    }

    requestAnimationFrame(this.draw)
  }

  render() {
    return (
      <canvas
        ref={this.canvas}
        width={this.props.size}
        height={this.props.size}
      />
    )
  }
}
