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

const IncButton = styled(Button)`
  font-size: 10px;
  height: 15px;
  min-width: 25px;
`

export default props => (
  <Box>
    {props.label}
    <IncButton onClick={()=>props.set(props.amt-1)}>-1</IncButton>
    {props.amt}
    <IncButton onClick={()=>props.set(props.amt+1)}>+1</IncButton>
  </Box>
)
