import React from 'react'
import styled from 'styled-components'
import Lazy from 'lazy.js'

import { ProtoPort } from '../../pieces/prototypes'
import Button from '../../components/Button'
import broker from '../../broker'

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
  font-size: 14px;
`

const Box = styled.div`
  display: flex;
  flex-direction: column;
  width: 105px;
  border: solid black 1px;
  height: ${ProtoPort.height-26}px;
  padding: 3px 1px 0 1px;

  & > * {
    padding-bottom: 2px;
  }
`

const HeaderBox = styled.div`
  display: flex;
  justify-content: space-between;
`

const Title = styled.div`
  font-size: 10px;
  color: blue;
`

const CancelOrder = styled(Button)`
  font-size: 7px;
  height: 11px;
  margin: 0;
  padding: 0 1px 2px 1px;
`

const cancel = id => broker.post({ sub: 'cancelorder', body: id })

const Header = props => (
  <HeaderBox>
    <Title>{`${props.orderNumber}: ${props.customer}`}</Title>
    <CancelOrder onClick={()=>cancel(props.id)}>X</CancelOrder>
  </HeaderBox>
)

export default props => {
  if (props.want) {
    return (
      <Box>
        <Header {...props} />
        <Timer deadline={props.deadline} />
        {Lazy(props.want)
          .map((amt, unitType, i) => (
            <OrderItem key={unitType+i}>
              {unitType[0].toUpperCase()+unitType.slice(1)}: {props.units[unitType] ? props.units[unitType].length : 0} / {amt}
            </OrderItem>
          ))
          .toArray()
        }
      </Box>
    )
  } else {
    return (
      <Box>
        <Header {...props} />
        Deadline passed!
      </Box>
    )
  }
}
