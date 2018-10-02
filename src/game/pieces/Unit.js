import React from 'react';

const Container = styled.div`
  height: 32px;
  width: 32px;
  background-image: url(${p => p.icon});
  background-size: 100% 100%;
`;

export default props => (
  <Container>
  </Container>
);
