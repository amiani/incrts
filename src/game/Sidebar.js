import React from 'react'
import styled from 'styled-components'

import GameContext from './gameContext'
import Button from './pieces/components/Button'
import { OBSERVEDBITS } from './constants'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const ResourceInfo = styled.p`
`

export default class Sidebar extends React.Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    return (
      <GameContext.Consumer
        unstable_observedBits={OBSERVEDBITS.resources}
      >{store => (
        <Container>
          <div>
            <ResourceInfo>Credits: {store.credits.toFixed(0)}</ResourceInfo>
            <ResourceInfo>Fabric: {store.fabric.toFixed(0)}</ResourceInfo>
            <ResourceInfo>Hardware: {store.hardware.toFixed(0)}</ResourceInfo>
            <ResourceInfo>Energy: {store.energy.toFixed(1)}</ResourceInfo>
            <ResourceInfo>Drain: {store.getBuildingsDrain()}</ResourceInfo>
            <ResourceInfo>Productivity: {(store.productivity * 100).toFixed(0)}%</ResourceInfo>
          </div>
          <Button onClick={store.buildFactory}>Build Factory</Button>
          <Button onClick={store.buildAssembler}>Build Assembler</Button>
          <Button onClick={store.buildGenerator}>Build Generator</Button>
        </Container>
      )}</GameContext.Consumer>
    )
  }
}
