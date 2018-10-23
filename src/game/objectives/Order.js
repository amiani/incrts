import React from 'react'
import styled from 'styled-components'
import uuidv4 from 'uuid/v4'
import Lazy from 'lazy.js'

//import broker from '../broker'

export default class Order {
  constructor() {
    this.setDeadline(20000)
  }

  id = uuidv4()
  units = {}
  deadline = null
  order = { tanks: 5 }
  Component = OrderComponent

  getProps = () => ({
    deadline: this.deadline,
    order: this.order,
    units: this.units,
  })

  dispatch = shipment => {
    this.units = Lazy(this.units)
      .merge(shipment)
      .toObject()
  }

  update = () => {
    if (this.order) {
      const totalUnitsLeft = Lazy(this.order)
        .reduce((acc, curr, currType) => {
          let unitsLeft = curr - (this.units[currType] ? this.units[currType].length : 0)
          unitsLeft = unitsLeft >= 0 ? unitsLeft : 0
          return acc + unitsLeft
        }, 0)
      if (totalUnitsLeft <= 0) {
        //broker.post({ name: 'addcredits', body: 100 })
        this.order = null
        this.deadline = null
      }
    }
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

const Box = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const Timer = styled.div`
`

const OrderItem = styled.div`
`

class OrderComponent extends React.Component {
  render() {
    const timeLeft = new Date(this.props.deadline - Date.now())
    if (this.props.order) {
      return (
        <Box>
          {Lazy(this.props.order)
            .map((amt, unitType, i) => (
              <OrderItem key={unitType+i}>
                {unitType}: {this.props.units[unitType] ? this.props.units[unitType].length : 0} / {amt}
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
        </Box>
      )
    } else {
      return (
        <Box>
          Deadline passed!
        </Box>
      )
    }
  }
}
