import React from 'react'
import styled from 'styled-components'

const Box = styled.div`
  display: flex;
  height: 50px;
`

const ModIcon = styled.div`
  height: 48px;
  width: 48px;
  background-image: url(images/${p => p.icon});
  background-size: 100% 100%;
  flex-shrink: 0;

  :hover {
    background-image:
      url(images/modupgradearrow.png);
  }
`

export default class ModFront extends React.Component {
  render() {
    return (
      <Box>
        <ModIcon icon={this.props.mod.icon} />
      </Box>
    )
  }
}
