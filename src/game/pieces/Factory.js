import React from 'react'

export default class Factory extends React.Component {
  static defaultCost = () => ({ credits: 100 })

  update = () => {
  }

  toString = () => 'factory'
}
