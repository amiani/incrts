import React from 'react'
import styled from 'styled-components'

const Box = styled.div`
  color: red;
  height: 10px;
  flex-shrink: 0;
  font-size: 10px;
`
const Message = styled.div`
  opacity: 0;
  @keyframes flash {
    0% { opacity: 0 }
    50% { opacity: 1 }
    100% { opacity: 0 }
  }
  animation: flash 1s linear 2;
`

export default class MessageBox extends React.Component {
  state = { key: 1 }

  componentDidUpdate(prevProps, prevState, _) {
    if (prevProps.message !== this.props.message)
      this.setState({ key: prevState.key + 1 })
  }

  render() {
    return (
      <Box>
        <Message key={this.state.key}>
          {this.props.message}
        </Message>
      </Box>
    )
  }
}
