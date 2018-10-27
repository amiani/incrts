import React from 'react'
import styled from 'styled-components'
import Lazy from 'lazy.js'

import broker from './broker'
import { ProtoAssembler, ProtoFactory, ProtoGenerator } from './pieces/prototypes'
import OrderViewer from './objectives/Order/OrderViewer'
import Factory from './pieces/Factory'
import Assembler from './pieces/Assembler'
import Generator from './pieces/Generator'
import Port from './pieces/Port'

const Box = styled.div`
  display: grid;
  grid:
    "factories ports" 1fr
    "assemblers ports" 1fr
    "generators ports" 1fr
    / 4fr 1fr;
  height: 100vh;
  padding: 5px;
`

const BuildingRow = styled.div`
  display: flex;
  /*height: ${p => p.height}px;*/
  grid-area: ${p=>p.area};
  align-self: center;
  overflow: auto;
`
const PortColumn = styled.div`
  display: flex;
  flex-direction: column;
  grid-area: ports;
  overflow: auto;
`

export default class Base extends React.Component {
  state = {
    factories: {},
    assemblers: {},
    generators: {},
    orders: {}
  }

  constructor() {
    super()
    broker.addListener(
      'buildings',
      { id: 'Base', onmessage: body => this.setState(body) }
    )
    broker.addListener(
      'building',
      {
        id: 'Base',
        onmessage: b => this.setState((prev, _) => ({
          [b.type]: { ...prev[b.type], [b.id]: b }
        }))
      }
    )
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
      <Box>
        <BuildingRow height={ProtoFactory.height+12} area='factories'>
          {Lazy(this.state.factories).map(b => (
            <Factory
              key={b.id}
              factory={b}
            />
          )).toArray()}
        </BuildingRow>
        <BuildingRow height={ProtoAssembler.height+12} area='assemblers'>
          {Lazy(this.state.assemblers).map(b => (
            <Assembler
              key={b.id}
              assembler={b}
            />
          )).toArray()}
        </BuildingRow>
        <BuildingRow height={ProtoGenerator.height+12} area='generators'>
          {Lazy(this.state.generators).map(b => (
            <Generator
              key={b.id}
              generator={b}
            />
          )).toArray()}
        </BuildingRow>
        <PortColumn>
          <OrderViewer orders={this.state.orders} />
          {Lazy(this.state.ports).map(p => (
            <Port key={p.id} {...p} orders={this.state.orders} />
          ))
          .toArray()}
        </PortColumn>
      </Box>
    )
  }
}
