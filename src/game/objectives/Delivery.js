import React from 'react'
import styled from 'styled-components'
import uuidv4 from 'uuid/v4'
import Lazy from 'lazy.js'

export default class Delivery {
  id = uuidv4()
  units = {}
  Component = DeliveryComponent

  dispatch = shipment => {
    this.units = Lazy(this.units)
      .merge(shipment)
      .toObject()
  }

  update = () => {
  }
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

class DeliveryComponent extends React.Component {
  state = {
    deadline: null,
    order: { tanks: 5 },
  }

  componentDidMount() {
    this.setDeadline(3000)
  }

  setDeadline = milliseconds => {
    this.setState(
      { deadline: new Date(Date.now() + milliseconds) },
      () => setTimeout(this.checkDeadline, milliseconds)
    )
  }

  checkDeadline = () => {
    if (this.state.deadline && Date.now() >= this.state.deadline) {
      this.setState({ order: null })
    }
  }

  render() {
    const timeLeft = new Date(this.state.deadline - Date.now())
    if (this.state.order) {
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
            Time Left:  
            {timeLeft.getMinutes()}
            :
            {timeLeft.getSeconds()}
          </Timer>
        </Container>
      )
    } else {
      return (
        <Container>
          Deadline passed!
        </Container>
      )
    }
  }
}
