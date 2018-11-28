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
    const period = 10
    ctx.clearRect(0, 0, this.props.width, this.props.height)
    const { min, max } = Lazy(this.props.data)
      .reduce((dataAcc, series) => series
        .slice(-period-1)
        .reduce((seriesAcc, point) => {
          if (point > seriesAcc.max) seriesAcc.max = point
          if (point < seriesAcc.min) seriesAcc.min = point
          return seriesAcc
        }, dataAcc),
        { min: 1000, max: 0 }
      )
    const range = max - min
    //console.log(max, min)
    //const vertScale = (10 * (max - min)) / this.props.height
    const horiScale = this.props.width / period

    const coords = []
    Lazy(this.props.data)
      .each(series => {
        ctx.beginPath()
        //console.log(series.slice(-10))
        series
          .slice(-period-1)
          .forEach((count, t) => {
            const x = t * horiScale
            const y = this.props.height * ((max - count) / range)
            coords[t] = { x, y }
            ctx.lineTo(x, y)
          })
        ctx.strokeStyle = 'blue'
        ctx.stroke()
      })
    //console.log(this.props.height)
    //console.log(coords)
  }

  renders = 0
  shouldComponentUpdate() {
    this.renders++
    if (this.renders >= 200)
      return false
    else
      return true
  }

  render() {
    console.log(this.props.data)
    this.props.data.tanks && console.log(this.props.data.tanks.slice(-11))
    return (
      <canvas
        ref={this.canvas}
        width={this.props.width}
        height={this.props.height}
      />
    )
  }
}
