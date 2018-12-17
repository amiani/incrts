import React from 'react'
import styled from 'styled-components' 

const Box = styled.div`
  flex-shrink: 0;
`

export default class Oscillator extends React.Component {
  state = { padding: 1 }
  constructor(props) {
    super(props)
    this.canvas = React.createRef()
  }

  componentDidMount() {
    requestAnimationFrame(this.draw)
    this.tminusone = performance.now()
  }

  componentDidUpdate(prevProps, prevState, _) {
    this.prevPX = prevProps.position.x
    this.prevPY = prevProps.position.y
    this.tminusone = performance.now()
  }

  prevPX = 0
  prevPY = 0
  draw = now => {
    const timeDelta = (now - this.tminusone)/100
    const ctx = this.canvas.current.getContext('2d')
    const { size } = this.props
    const center = size/2
    const massR = size/20
    ctx.clearRect(0, 0, size, size)

    ctx.beginPath()
    ctx.arc(center, center, size/2-1, 0, 2*Math.PI, true)
    ctx.strokeStyle = '#ee855e'
    ctx.lineWidth = 2
    ctx.stroke()


    const x = timeDelta * (this.props.position.x - this.prevPX) + this.prevPX
    const y = timeDelta * (this.props.position.y - this.prevPY) + this.prevPY
    ctx.beginPath()
    ctx.arc(x + center, -y + center, massR, 0, 2*Math.PI, true)
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
