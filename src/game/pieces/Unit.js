import React from 'react';

const Box = styled.div`
  height: 32px;
  width: 32px;
  background-image: url(${p => p.icon});
  background-size: 100% 100%;
`;

export default props => (
  <Box>
  </Box>
);
