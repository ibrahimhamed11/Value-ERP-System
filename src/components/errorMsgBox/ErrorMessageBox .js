import React from 'react';
import { Box, Typography, Grid, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ErrorMessageBox = ({ errorMessage, onClose }) => {
  return (
    <Grid item xs={12} md={12}>
      {errorMessage && (
        <Box
          sx={{
            backgroundColor: 'pink',
            color: 'red',
            padding: '8px',
            borderRadius: '4px',
            width: '100%',
            marginTop: '0px',
            marginBottom: '10px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textAlign: 'center'
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            {errorMessage}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      )}
    </Grid>
  );
};

export default ErrorMessageBox;
