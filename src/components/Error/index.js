import React from 'react';
import { Box, Typography } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';
const ErrorWrapper = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '700px',
      }}>
      <ErrorIcon color="error" sx={{ width: '50px', height: '50px' }} />
      <Typography variant="h1" color="error" sx={{ ml: 5 }}>
        Can't load the Data
      </Typography>
    </Box>
  );
};

export default ErrorWrapper;
