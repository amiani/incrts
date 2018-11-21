import React from 'react'
import Lazy from 'lazy.js'
import styled from 'styled-components'

import Button from '../Button'

const Box = styled.div`
  display: flex;
  flex-direction: column;
  border: solid #ee855e 2px;
`

const Header = styled.div`
  display: flex;
`

const ProcedureList = styled.div`
  display: flex;
  flex-direction: column;
`

const Procedure = styled.div`
  height: 15px;
`

export default class ProcedureMenu extends React.Component {
  state = {
    tab: 0,
  }

  handleDragStart = (event, procId) => {
    event.dataTransfer.setData('id', procId)
  }

  render() {
    return (
      <Box>
        <Header>
          <Button>Assembler</Button>
          <Button>Crucible</Button>
        </Header>
        <ProcedureList>
          {Lazy(this.props.procedures)
            .map(p => (
              <Procedure
                key={p.id}
                draggable
                onDragStart={e => this.handleDragStart(e, p.id)}
              >
                {p.name}
              </Procedure>
            ))
            .toArray()
          }
        </ProcedureList>
      </Box>
    )
  }
}
