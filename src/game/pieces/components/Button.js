import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: inline;
  flex-shrink: 0;
  height: 20px;
  border: solid black 2px;
  border-radius: 3px;
  margin: 1px;
  padding: 1px 3px 0px 3px;
  font-size: 12px;
  text-align: center;
  min-width: 28px;

  :hover {
    background-color: green;
    color: #ffffff;
    border: solid black 2px;
  }
`

export default props => (
  <Container onClick={props.onClick}>
    {props.children}
  </Container>
)
