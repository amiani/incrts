import React from 'react'
import styled from 'styled-components'

const Box = styled.div`
  flex-shrink: 0;
`

export default class Oscillator extends React.Component {
  constructor(props) {
    super(props)
    this.canvas = React.createRef()
  }

  componentDidMount() {
    requestAnimationFrame(this.draw)
  }

  cartesianToMagnitude = (x, y) => Math.sqrt(x*x, y*y)
  prevPX = 80
  prevPY = 30
  prevVX = 0
  prevVY = 0
  draw = now => {
    if (!this.start) this.start = now
    const timeDelta = (now - this.start) / 1000
    const ctx = this.canvas.current.getContext('2d')
    const { size } = this.props
    const halfSize = size/2
    const massR = size/20
    ctx.clearRect(0, 0, size, size)

    ctx.beginPath()
    ctx.arc(halfSize, halfSize, halfSize, 0, 2*Math.PI, true)
    ctx.strokeStyle = '#ee855e'
    ctx.lineWidth = 2
    ctx.stroke()

    const k = .01
    const g = .005
    const aX = -k*this.prevPX
    const aY = -k*this.prevPY
    const dampX = -g*this.prevVX
    const dampY = -g*this.prevVY
    const vX = this.prevVX + (aX + dampX) * timeDelta
    const vY = this.prevVY + (aY + dampY) * timeDelta
    let pX = this.prevPX + vX * timeDelta
    let pY = this.prevPY + vY * timeDelta
    const magnitude = this.cartesianToMagnitude(pX, pY)
    const maxMag = halfSize - 2*massR
    if (magnitude > maxMag) {
      pX *= maxMag/magnitude
      pY *= maxMag/magnitude
    } else if (magnitude < 0.0000001) {
      pX = 0
      pY = 0
    }
    ctx.beginPath()
    ctx.arc(pX + halfSize, -pY + halfSize, massR, 0, 2*Math.PI, true)
    ctx.fillStyle = 'red'
    ctx.fill()
    this.prevVX = vX
    this.prevVY = vY
    this.prevPX = pX
    this.prevPY = pY

    requestAnimationFrame(this.draw)
  }

  render() {
    return (
      <Box>
        <canvas
          ref={this.canvas}
          width={this.props.size}
          height={this.props.size}
        />
      </Box>
    )
  }
}
