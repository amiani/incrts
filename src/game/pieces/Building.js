import React from 'react';
import uuidv4 from 'uuid/v4';
import styled from 'styled-components';

export default class Building {
  constructor(width, height) {
    this.key = uuidv4();
    this.Container = styled.div`
      width: ${width}px;
      height: ${height}px;
      border: solid black 1px;
      margin: 0 5px 0 5px;
      padding: 5px;
      display: flex;
      flex-direction: column;
    `;
  }

  toString = () => this.name;

  getComponent = () => (
    <this.Component
      key={this.key}
    />
  )
}
