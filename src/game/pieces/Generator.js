import React from 'react'
import uuidv4 from 'uuid/v4'
import styled from 'styled-components'

import Building from './Building'
import ModulePanel from '../components/modules/ModulePanel'
import Button from '../components/Button'

export function ProtoGenerator() {
  this.id = uuidv4()
  this.type = 'generators'
  this.name = 'generator'
  this.cost = { credits: 50, fabric: 50 }
  this.output = 0
}
ProtoGenerator.width = 200
ProtoGenerator.height = 200

const FrontBox = styled.div`
`

export default props => (
  <Building
    width={ProtoGenerator.width}
    height={ProtoGenerator.height}
    front={
      <FrontBox>
        <Button onClick={()=>props.store.addEnergy(10)}>Generate 10</Button>
        <ModulePanel modules={props.generator.modules} />
      </FrontBox>
    }
    back={
        <p>This is the back of the Generator</p>
    }
  />
)
