import React from 'react'
import styled from 'styled-components'
import Lazy from 'lazy.js'

import Order from '.'
import MessageBox from '../../components/MessageBox'
import { ProtoPort } from '../../pieces/prototypes'

const Box = styled.div`
  width: ${ProtoPort.width}px;
  border: solid black 2px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const OrderBox = styled.div`
  display: flex;
  overflow: auto;

  & > * {
    margin-left: 2px;
    margin-right: 2px;
    flex-shrink: 0;
  }
`

export default class OrderViewer extends React.Component {
  state = { selected: '', message: '' }

  componentDidUpdate(prevProps, prevState, _) {
    Lazy(this.props.orders)
      .keys()
      .without(Object.keys(prevProps.orders))
  }

  render() {
    return (
      <Box>
        <MessageBox height='30' message={this.state.message} />
        <OrderBox>
          {Lazy(this.props.orders)
            .map(o => <Order key={o.id} {...o} />)
            .toArray()
          }
        </OrderBox>
      </Box>
    )
  }
}
