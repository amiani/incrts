import React from 'react'
import styled from 'styled-components'
import uuidv4 from 'uuid/v4'
import Lazy from 'lazy.js'

export default class Delivery {
  constructor(store) {
    this.store = store
    this.setDeadline(20000)
  }

  id = uuidv4()
  units = {}
  deadline = null
  order = { tanks: 5 }
  Component = DeliveryComponent

  getProps = () => ({
    deadline: this.deadline,
    order: this.order,
    units: this.units,
  })

  dispatch = shipment => {
    const unitsSeq = Lazy(this.units)
      .merge(shipment)

    if (this.order) {
      const totalUnitsLeft = unitsSeq
        .reduce((acc, curr, currType) => {
          let unitsLeft = this.order[currType] - curr.length
          unitsLeft = unitsLeft >= 0 ? unitsLeft : 0
          return acc + unitsLeft
        }, 0)
      if (totalUnitsLeft <= 0) {
        this.store.addCredits(100)
        this.order = null
        this.deadline = null
      }
    }

    this.units = unitsSeq.toObject()
  }

  update = () => {
  }

  isFulfilled = () => {
  }

  setDeadline = milliseconds => {
    this.deadline = new Date(Date.now() + milliseconds)
    setTimeout(this.checkDeadline, milliseconds)
  }

  checkDeadline = () => {
    if (this.deadline && Date.now() >= this.deadline) {
      this.order = null
    }
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
  render() {
    const timeLeft = new Date(this.props.deadline - Date.now())
    if (this.props.order) {
      return (
        <Container>
          {Lazy(this.props.order)
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
