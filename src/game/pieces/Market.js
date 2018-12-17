import React from 'react'
import styled from 'styled-components'
import Lazy from 'lazy.js'
import 'react-perfect-scrollbar/dist/css/styles.css'
import PerfectScrollbar from 'react-perfect-scrollbar'

import Button from '../components/Button'
import broker from '../broker'
import { BOARDANGLE, BOARDDIST, MODHEIGHT, TOPROWDIST } from '../constants'
import Apparatus from './Apparatus'
import { ProtoCrucible, ProtoAssembler } from './prototypes'

const HOVERDIST = -ProtoAssembler.height/2*Math.cos(Math.PI-BOARDANGLE)
const Box = styled.div`
  grid-row: 2;
  grid-column: -2;
  transform-origin: top;
  transition: transform ease 200ms;
  transform-style: preserve-3d;
  //transform: rotate3d(1, 0, 0, ${BOARDANGLE/3}rad);

  /*
  :hover {
    transform:
      rotate3d(1, 0, 0, ${-3*BOARDANGLE/4}rad)
      translate3d(
        0,
        ${HOVERDIST*Math.cos(BOARDANGLE)}vh, 
        ${HOVERDIST*Math.sin(BOARDANGLE)}vh
      )
  }
  */
`

const ContractBox = styled.div`
  height: 15%;
  color: white;
  background-color: rgba(238, 133, 93, ${p=>p.odd ? 0 : .05});
  display: flex;
  align-items: center;
  justify-content: space-around;
`

const Customer = styled.div`
  font-size: .6em;
`

const Period = styled.div`
`

const DesiredRate = styled.div`
`

const AcceptButton = styled(Button)`
  visibility: hidden;
  ${ContractBox}:hover & {
    visibility: visible;
  }
`

const Contract = props => {
  return (
    <ContractBox odd={props.odd}>
      <Customer>{props.customer}</Customer>
      <Period>{props.period}s</Period>
      {Lazy(props.desiredRates)
        .map((r, unit) => <DesiredRate key={unit}>{unit}: {r}u/s</DesiredRate>)
        .toArray()}
      <AcceptButton onClick={()=>props.onAccept(props.id)}>Accept</AcceptButton>
    </ContractBox>
  )
}

export default class Market extends React.Component {
  state = {
    tab: 0,
    contracts: {},
  }

  constructor(props) {
    super()
    broker.addListener('contracts', 'market', this.handleContracts)
  }

  handleContracts = contracts => this.setState({ contracts })
  acceptContract = contractId => {
    broker.post({
      sub: 'acceptContract',
      body: { contractId }
    })
  }

  render() {
    let i = 0
    return (
      <Box>
        {/*using Apparatus until sure it won't flip*/}
        <Apparatus  
          width={ProtoAssembler.width}
          height={22.222222}
          header={
            <React.Fragment>
              <Button onClick={()=>this.setState({tab: 0})}>Contracts</Button>
              {/*<Button onClick={()=>this.setState({tab: 1})}>Patents</Button>*/}
            </React.Fragment>
          }
          front={
            <PerfectScrollbar style={{ height: '90%' }}>
              {this.state.tab === 0 ? (
                Lazy(this.state.contracts)
                  .map(c => {
                    i++
                    return <Contract
                      {...c}
                      key={c.id}
                      odd={!!(i%2)}
                      onAccept={this.acceptContract}
                    />
                  })
                  .toArray()
              ) : (
                <p>Patents!</p>
              )}
            </PerfectScrollbar>
          }
        />
      </Box>
    )
  }
}
