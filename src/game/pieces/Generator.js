import React from 'react'
import uuidv4 from 'uuid/v4'
import styled from 'styled-components'

import Building from './Building'
import { ModPanelFront } from '../components/mods/ModPanel'
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

const BoxFront = styled.div`
`

export default props => (
  <Building
    width={ProtoGenerator.width}
    height={ProtoGenerator.height}
    front={
      <BoxFront>
        <Button onClick={()=>props.store.addEnergy(10)}>Generate 10</Button>
        <ModPanelFront mods={props.generator.mods} />
      </BoxFront>
    }
    back={
        <p>This is the back of the Generator</p>
    }
  />
)
