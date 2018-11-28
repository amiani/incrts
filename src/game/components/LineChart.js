import React from 'react'
import styled from 'styled-components'
import Lazy from 'lazy.js'

const Box = styled.div`
  height: 100%;
  width: 100%;
`

export default class UnitChart extends React.Component {
  constructor(props) {
    super()
    this.canvas = React.createRef()
  }

  componentDidMount() {
    this.draw()
  }

  componentDidUpdate() {
    this.draw()
  }

  draw() {
    const ctx = this.canvas.current.getContext('2d')
    const period = 30
    ctx.clearRect(0, 0, this.props.width, this.props.height)
    let { min, max } = Lazy(this.props.data)
      .reduce((dataAcc, series) => series
        .slice(-period-1)
        .reduce((seriesAcc, point) => {
          if (point > seriesAcc.max) seriesAcc.max = point
          if (point < seriesAcc.min) seriesAcc.min = point
          return seriesAcc
        }, dataAcc),
        { min: 1000, max: 0 }
      )
    if (max - min < 10)
      max += 10 - max - min
    const range = max - min
    const horiScale = this.props.width / period
    const vertScale = this.props.height / 10

    ctx.lineWidth = 1
    ctx.globalAlpha = .3
    for (let i = 1; i < (period / 5); i++) {
      ctx.beginPath()
      const x = i * horiScale * 5
      ctx.moveTo(x, 0)
      ctx.lineTo(x, this.props.height)
      ctx.strokeStyle = 'white'
      ctx.stroke()
    }

    for (let i = 1; i < 10; i++) {
      ctx.beginPath()
      const y = i * vertScale
      ctx.moveTo(0, y)
      ctx.lineTo(this.props.width, y)
      ctx.strokeStyle = 'white'
      ctx.stroke()
    }


    ctx.lineWidth = 2
    ctx.globalAlpha = 1
    const coords = []
    Lazy(this.props.data)
      .each(series => {
        ctx.beginPath()
        series
          .slice(-period-1)
          .forEach((count, t) => {
            const x = t * horiScale
            const y = this.props.height * ((max - count) / range)
            coords[t] = { x, y }
            ctx.lineTo(x, y)
          })
        ctx.strokeStyle = '#ee855e'
        ctx.stroke()
      })

    ctx.font = '20px sans-serif'
    ctx.fillStyle = 'yellow'
    ctx.fillText('(' + min + ', ' + max +')', 0, 20)
  }

  render() {
    return (
      <canvas
        ref={this.canvas}
        width={this.props.width}
        height={this.props.height}
      />
    )
  }
}
