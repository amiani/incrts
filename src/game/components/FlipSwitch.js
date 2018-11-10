import React from 'react'
import styled from 'styled-components'

const Box = styled.div`
  height: 20px;
  width: 50px;
  perspective: 300px;
  background-color: white;
`

const Flipper = styled.div`
  position: relative;
  transform-style: preserve-3d;
  height: 100%;
  width: 100%;
  transform: translateZ(-10px) rotateX(${p => p.on ? 0 : 90}deg);
  transition: transform 350ms;
`

const Face = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  font-size: 12px;
`

const On = styled(Face)`
  transform: translateZ(10px);
  background-color: green;
`

const Off = styled(Face)`
  transform: rotateX(-90deg) translateZ(10px);
  background-color: red;
`

export default props => {
  return (
    <Box onClick={props.handleClick}>
      <Flipper on={props.on}>
        <On>On</On>
        <Off>Off</Off>
      </Flipper>
    </Box>
  )
}
