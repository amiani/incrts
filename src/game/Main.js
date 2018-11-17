import React from 'react'

import LeftSider from './LeftSider'
import RightSider from './RightSider'
import Base from './Base'
import broker from './broker'

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

  divStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    height: '100vh',
    width: '100vw'
  }

  render() {
    return (
      <div style={this.divStyle}>
        <LeftSider />
        <Base />
        <RightSider />
      </div>
    )
  }
}
