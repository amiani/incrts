import React from 'react'
import styled from 'styled-components'

import Port from '../Port'

const Box = styled.div`
  display: flex
  flex-direction: column
  justify-content: space-between
`

export default class Battlefield extends React.Component {
  state = {
    tanks: Array(1000000).fill({ sub: 'hello', stat: 10 }),
  }

  render() {
    return (
      <Box>
        <div>Battlefield</div>
        <Port
          store={this.props.store}
          hangar={this.props.store.hangars[this.props.battlefield.hangarId]}
        />
      </Box>
    )
  }
}
