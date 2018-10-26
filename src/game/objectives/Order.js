import React from 'react'
import styled from 'styled-components'
import Lazy from 'lazy.js'

const TimerBox = styled.div`
  font-size: 10px;
`

class Timer extends React.Component {
  componentDidMount() {
    this.handle = setInterval(()=>this.forceUpdate(), 1000)
  }

  componentWillUnmount() {
    clearInterval(this.handle)
  }

  render() {
    const timeLeft = new Date(this.props.deadline - Date.now())
    return <TimerBox>
      Time Left: {timeLeft.getMinutes()}: {timeLeft.getSeconds()}
    </TimerBox>
      
  }
}

const OrderItem = styled.div`
`

const Box = styled.div`
  display: flex;
  flex-direction: column;
  border: dashed black 1px;
`

export default props => {
  if (props.want) {
    return (
      <Box>
        <Timer deadline={props.deadline} />
        {Lazy(props.want)
          .map((amt, unitType, i) => (
            <OrderItem key={unitType+i}>
              {unitType}: {props.units[unitType] ? props.units[unitType].length : 0} / {amt}
            </OrderItem>
          ))
          .toArray()
        }
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
