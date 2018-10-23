import React from 'react'
import styled from 'styled-components'

import Building from './Building'
import { ModPanelFront } from '../components/mods/ModPanel'
import Button from '../components/Button'
import { ProtoGenerator } from './prototypes'

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
