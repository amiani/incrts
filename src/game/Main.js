import React from 'react'
import styled from 'styled-components'

import LeftSider from './LeftSider'
import RightSider from './RightSider'
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
    broker.post({ sub: 'buildassembler' })
    broker.post({ sub: 'buildcrucible' })
    broker.post({ sub: 'buildport' })
    broker.post({ sub: 'buildgenerator' })

    for (let i = 0; i <= 6; i++)
      broker.post({ sub: 'makeorder' })
  }

  render() {
    return (
      <Box>
        <LeftSider />
        <Base />
        <RightSider />
      </Box>
    )
  }
}
