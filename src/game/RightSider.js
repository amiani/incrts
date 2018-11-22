import React from 'react'
import styled from 'styled-components'
import Lazy from 'lazy.js'

import broker from './broker'
import OrderViewer from './objectives/Order/OrderViewer'
import Port from './pieces/Port'

const Box = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: red;
  width: 200px;
  background-color: #002836;
`

/*
const PortColumn = styled.div`
  display: flex;
  flex-direction: column;
  grid-area: ports;
  overflow-y: auto;

  & > * {
    margin-bottom: 5px;
    flex-shrink: 0;
  }
`
*/

export default class RightSider extends React.Component {
  state = {
    orders: {}
  }

  constructor() {
    super()
    broker.addListener(
      'orders',
      { id: 'Base', onmessage: orders => this.setState({ orders }) }
    )
    broker.addListener(
      'order',
      {
        id: 'Base',
        onmessage: order => this.setState((prev, _) => ({
          orders: { ...prev.orders, [order.id]: order }
        }))
      }
    )
  }

  render() {
    return (
      <React.Fragment />
    )
  }
}
