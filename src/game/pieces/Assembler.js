import React from 'react'

export default class Assembler extends React.Component {
  static defaultCost = () => ({ credits: 50, fabric: 50 })

  update = () => {
  }

  toString = () => 'assembler'
}
