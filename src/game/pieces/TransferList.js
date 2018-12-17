import React from 'react'
import styled from 'styled-components'
import Lazy from 'lazy.js'

import broker from '../broker'
import { BOARDANGLE, BOARDDIST, PERSPECTIVE } from '../constants'
import { ProtoAssembler } from './prototypes'

const TransferBox = styled.div`
  height: 16.6666666%;
  display: flex;
`

const RateBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Rates = styled.div`
  display: flex;
  justify-content: space-between;
`

const UnitName = styled.div`
`

const CurrRate = styled.div`
  color: ${p => p.color};
`

const DesiredRate = styled.div`
`

const Rate = props => {
  const color = props.currRate < props.desiredRate
    ? 'red'
    : props.currRate > props.desiredRate ? 'green' : 'white'
  return (
    <RateBox>
      <UnitName>{props.unit}</UnitName>
      <CurrRate color={color}>current rate: {props.currRate}/s</CurrRate>
      <DesiredRate>desired rate: {props.desiredRate}/s</DesiredRate>
    </RateBox>
  )
}

const TimeLeft = styled.div`
  font-size: 2em;
`

class Transfer extends React.Component {
  render() {
    return (
      <TransferBox>
        <Rates>
          {Lazy(this.props.rates).map((r, unit) => <Rate key={unit} {...r} />).toArray()}
        </Rates>
        <TimeLeft>{this.props.period}</TimeLeft>
      </TransferBox>
    )
  }
}

const HOVERDIST = 20
const transy = (-90/6)*(1+BOARDDIST/PERSPECTIVE)
const Box = styled.div`
  grid-row: 1;
  transform-origin: top;
  transition: transform ease 200ms;
  transform-style: preserve-3d;
  /*
  :hover {
    transform:
      rotate3d(1, 0, 0, -5deg)
      translate3d(
        0,
        ${-HOVERDIST*Math.cos(BOARDANGLE)}px,
        ${HOVERDIST*Math.sin(BOARDANGLE)}px
      )
    ;
  }
  */
  display: flex;
  flex-direction: column;
  width: ${ProtoAssembler.width}px;
  height: 100%;
  border: solid #ee855e 2px;
  background-color: rgba(238, 133, 93, .025);
`
export default class TransferList extends React.Component {
  state = {
    transfers: {},
  }

  constructor(props) {
    super()
    broker.addListener('transfers', 'transferlist', this.handleTransfers)
  }

  handleTransfers = transfers => this.setState({ transfers })

  render() {
    return (
      <Box>
        {Lazy(this.state.transfers)
          .map(t => <Transfer key={t.id} {...t} />)
          .toArray()
        }
      </Box>
    )
  }
}
