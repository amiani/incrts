import React from 'react'
import styled from 'styled-components'

import DemandControl from './components/Hangar/DemandControl'
import { ExpandingHangar } from './components/Hangar'
import Button from './components/Button'
import broker from './broker'

const Box = styled.div`
  height: 200px;
  border: solid black 1px;
  background-color: #e6f3f7;
  display: flex;

`

export default class Port extends React.Component {
  dispatch = () => {
    broker.post({ sub: 'dispatch', body: { hangarId: this.props.hangar.id } })
  }

  render() {
    return (
      <Box>
        <Button onClick={this.dispatch}>Dispatch</Button>
        <ExpandingHangar
          id={this.props.hangar.id}
          height={150}
          width={150}
          withControl={true}
        />
      </Box>
    )
  }
}
