import React from 'react'
import styled from 'styled-components'

import Button from '../Button'

const Box = styled.div`
  width: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
`

export default props => (
  <Box>
    {props.label}
    <Button onClick={()=>props.set(props.amt-1)}>-1</Button>
    {props.amt}
    <Button onClick={()=>props.set(props.amt+1)}>+1</Button>
  </Box>
)
