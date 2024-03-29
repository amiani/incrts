import React from 'react'
import Lazy from 'lazy.js'
import styled from 'styled-components'

import LeftSider from './LeftSider'
import Base from './Base'
import broker from './broker'

const Box = styled.div`
  display: flex;
  justify-content: space-between;
  height: 100vh;
  width: 100vw;
`

export default class Main extends React.Component {
  constructor(props) {
    super(props)
    this.initialize()
  }

  initialize = () => {
    broker.post({ sub: 'buildAssembler' })
    broker.post({ sub: 'buildPreaccelerator' })
    broker.post({ sub: 'addProcedure', })  //testing

    for (let i = 0; i <= 6; i++)
      broker.post({ sub: 'makeContract' })
  }

  render() {
    return (
      <Box>
        <LeftSider />
        <Base />
      </Box>
    )
  }
}
