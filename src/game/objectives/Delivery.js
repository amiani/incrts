import React from 'react'
import styled from 'styled-components'
import uuidv4 from 'uuid/v4'
import Lazy from 'lazy.js'

export function ProtoDelivery() {
  this.id = uuidv4()
  this.Component = Delivery
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const Timer = styled.div`
`

const OrderItem = styled.div`
`

export default class Delivery extends React.Component {
  state = {
    deadline: new Date(Date.now() + 1*60000),
    order: { tanks: 5 },
  }

  render() {
    const timeLeft = new Date(this.state.deadline - Date.now())
    return (
      <Container>
        {Lazy(this.state.order)
          .map((amt, unitType, i) => (
            <OrderItem key={unitType+i}>
              {unitType}: {amt}
            </OrderItem>
          ))
          .toArray()
        }
        <Timer>
          {timeLeft.getMinutes()}
          :
          {timeLeft.getSeconds()}
        </Timer>
      </Container>
    )
  }
}
