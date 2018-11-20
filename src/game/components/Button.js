import React from 'react'
import styled from 'styled-components'

const Box = styled.div`
  display: inline;
  flex-shrink: 0;
  height: 20px;
  border: solid 2px #ee855e; 
  border-radius: 3px;
  margin: 1px;
  padding: 1px 3px 1px 3px;
  font-size: 12px;
  text-align: center;
  //background-color: #EBE4FE;

  :hover {
    color: #002836;
    background-color: #ee855e; 
  }
`

export default props => (
  <Box onClick={props.onClick} className={props.className}>
    {props.children}
  </Box>
)
