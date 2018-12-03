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
    const g = this.props.harm * .005
    const aX = -k*this.prevPX
    const aY = -k*this.prevPY
    const dampX = -g*this.prevVX
    const dampY = -g*this.prevVY
    const vX = this.prevVX + (aX + dampX) * timeDelta
    const vY = this.prevVY + (aY + dampY) * timeDelta
    let pX = this.prevPX + vX * timeDelta
    let pY = this.prevPY + vY * timeDelta
    const posMag = this.cartesianToMagnitude(pX, pY)
    const maxMag = halfSize - 2*massR
    const minMag = 0.000001
    if (posMag > maxMag) {
      pX *= maxMag/posMag
      pY *= maxMag/posMag
    }
    if (posMag < minMag) {
      this.prevPX = 0
      this.prevPY = 0
    } else {
      this.prevPX = pX
      this.prevPY = pY
    }

    if (this.cartesianToMagnitude(vX, vY) < minMag) {
      this.prevVX = 0
      this.prevVY = 0
    } else {
      this.prevVX = vX
      this.prevVY = vY
    }

    ctx.beginPath()
    ctx.arc(pX + halfSize, -pY + halfSize, massR, 0, 2*Math.PI, true)
    ctx.fillStyle = 'red'
    ctx.fill()

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
