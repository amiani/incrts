import React from 'react'
import styled from 'styled-components'

const Box = styled.div`
  display: grid;
  height: ${p => p.height}px;
  grid-template-rows: repeat(${p=>p.rows}, 50px);
  grid-auto-flow: column;
`

const Procedure = styled.div`
  height: 50px
  width: 50px;
  background-image: url(images/${p=>p.icon});
  background-size: 100% 100%;

  :hover {
    border: solid pink 2px;
  }
`

export default props => {
  const rows = props.height / 50
  return (
    <Box height={props.height} rows={rows}>
      {props.procedures.map((r, i) => (
        <Procedure
          key={r.id+i}
          icon={r.icon}
          onClick={()=>props.enqueue(r)}
        />
      ))}
    </Box>
  )
}
