import React from 'react'
import styled from 'styled-components'

export default props => (
  <input
    type='checkbox'
    value={props.on}
    defaultChecked={props.on}
    onChange={props.handleChange}
  />
)
