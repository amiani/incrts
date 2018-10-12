import React from 'react'
import uuidv4 from 'uuid/v4'
import styled from 'styled-components'

import Port from '../Port'

export function ProtoBattlefield(hangarId) {
  this.id = uuidv4()
  this.Component = Battlefield
  this.hangarId = hangarId
  this.enroute = []
}

const Container = styled.div`
  display: flex
  flex-direction: column
  justify-content: space-between
`

export default class Battlefield extends React.Component {
  state = {
    tanks: Array(1000000).fill({ name: 'hello', stat: 10 }),
  }

  render() {
    return (
      <Container>
        <div>Battlefield</div>
        <Port
          store={this.props.store}
          hangar={this.props.store.hangars[this.props.battlefield.hangarId]}
        />
      </Container>
    )
  }
}
