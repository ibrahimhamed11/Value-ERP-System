import React from 'react';
import { Box, CircularProgress } from '@mui/material';
const LoadingWrapper = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '700px',
      }}>
      <CircularProgress color="secondary" />
    </Box>
  );
};

export default LoadingWrapper;
