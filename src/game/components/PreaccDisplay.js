import React from 'react'
import styled from 'styled-components'

import Button from './Button'
import Prering from './Prering'
import { ProtoPreaccelerator } from '../pieces/prototypes'

const Box = styled.div`
  display: flex;
  flex: 1 1 auto;
  justify-content: center;
  align-items: center;
  height: 90%;
  position: relative;
`

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
`

const SmashButton = styled(Button)`
  height: 30px;
  font-size: 30px;
`

const PreringOverlay = styled(Prering)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: -1;
`

export default class PreaccDisplay extends React.Component {
  constructor(props) {
    super()
    this.box = React.createRef()
  }

  render() {
    return (
      <Box ref={this.box}>
        {this.box.current && <React.Fragment>
          <PreringOverlay size={this.box.current.clientHeight} numParticles={20} />
          <InfoBox>
            <SmashButton onClick={this.props.onSmash}>Smash!</SmashButton>
            Particles In: 100
          </InfoBox>
        </React.Fragment>}
      </Box>
    )
  }
}
