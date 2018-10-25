import React from 'react'
import styled from 'styled-components'

import Sidebar from './Sidebar'
import Base from './Base'
import broker from './broker'

const Box = styled.div`
  display: flex;
  width: 100vw;
`

export default class Main extends React.Component {
  constructor(props) {
    super(props)
    this.initialize()
  }

  initialize = () => {
    broker.post({ sub: 'buildfactory' })
    broker.post({ sub: 'buildassembler' })
    broker.post({ sub: 'buildport' })
    broker.post({ sub: 'buildgenerator' })
    broker.post({ sub: 'makeorder' })
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
