import React from 'react'
import styled from 'styled-components'
import Lazy from 'lazy.js'

import Sidebar from './Sidebar'
import Base from './Base'
import Port from './Port'
import Order from './objectives/Order'
import broker from './broker'

const Box = styled.div`
  display: flex;
`


export default class Main extends React.Component {
  constructor(props) {
    super(props)
    this.initialize()
  }

  initialize = () => {
    broker.post({ sub: 'makeorder' })
    broker.post({ sub: 'buildfactory' })
    broker.post({ sub: 'buildassembler' })
    broker.post({ sub: 'buildgenerator' })
  }


  render() {
    return (
      <Box>
        <Sidebar />
        <Base />
      </Box>
    )
  }
}
