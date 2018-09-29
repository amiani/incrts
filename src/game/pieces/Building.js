import React from 'react';
import styled from 'styled-components';

export default styled.div`
  width: ${p=>p.width}px;
  height: ${p=>p.height}px;
  border: solid black 1px;
  margin: 0 5px 0 5px;
  padding: 5px;
  display: flex;
  flex-direction: column;
`;
