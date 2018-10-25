import React from 'react'
import Lazy from 'lazy.js'
import styled from 'styled-components'

import { ExpandingHangar } from '../components/Hangar'
import Button from '../components/Button'
import { ProtoPort } from './prototypes'
import broker from '../broker'
import { Order } from '../objectives'

const Box = styled.div`
  border: solid black 1px;
  background-color: #e6f3f7;
  display: grid;
  grid:
    "hangar dest" auto
    "dispatch select" 20px
    / 2fr 1fr;
  width: ${ProtoPort.width}px;
  height: ${ProtoPort.height}px;
`

const Dispatch = styled(Button)`
  grid-area: dispatch;
`

const OrderSelect = styled.select`
  grid-area: select;
`

export default class Port extends React.Component {
  state = { selected: '' }
  constructor(props) {
    super()
    this.id = props.id
  }

  dispatch = () => {
    !!this.state.selected && broker.post({
      sub: 'dispatch',
      body: {
        hangarId: this.props.hangarId,
        orderId: this.state.selected
      }
    })
  }

  handleChange = event => this.setState({
    selected: this.props.orders[event.target.value]
  })

  render() {
    return (
      <Box>
        <ExpandingHangar
          id={this.props.hangarId}
          width={ProtoPort.width/2}
          withControl={true}
        />
        <Dispatch onClick={this.dispatch}>Dispatch</Dispatch>
        {!!this.state.selected && <Order {...this.props.orders[this.state.selected]} />}
        <OrderSelect value={this.state.selected} onChange={this.handleChange}>
          <option disabled value=''>select an order</option>
          {Lazy(this.props.orders)
            .map(o => <option key={o.id} value={o.id}>{o.id.slice(0,8)}</option>)
            .toArray()
          }
        </OrderSelect>
      </Box>
    )
  }
}
