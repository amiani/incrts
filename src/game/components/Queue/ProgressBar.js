import React from 'react'
import styled from 'styled-components'

const Box = styled.div`
  height: 25%;
  border: 2px #ee855e;
  border-style: none none groove groove;
`

const Progress = styled.div`
  background-color: #ee855e;
  transform-origin: left;
  transform: scaleX(${p => p.progress > 100 ? 1 : p.progress/100});
  transition: transform ease 150ms;
  height: 100%;
`
//width: ${p => p.progress > 100 ? 100 : p.progress}%;

export default props => (
  <Box>
    <Progress progress={props.progress} />
  </Box>
)
