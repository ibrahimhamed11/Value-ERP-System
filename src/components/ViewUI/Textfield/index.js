import React, { useState, useEffect } from 'react';
import { TextField, useTheme } from '@material-ui/core';
import { useField } from 'formik';
import { useSelector } from 'react-redux';
import { Grid } from '@mui/material';

const TextfieldWrapper = ({ label, value }) => {
  const theme = useTheme();
  const customization = useSelector((state) => state.config);
  const textColor = customization.isLight ? '#C6C6C6' : 'white';

  // Create a local state for the value
  const [inputValue, setInputValue] = useState(value);

  // Update inputValue when the value prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          label={label}
          value={inputValue} // Use the local state for value
          fullWidth
          InputProps={{
            readOnly: true,
            style: {
              fontWeight: 'bold',
              fontSize: '1.2rem',
              color: textColor,
              borderColor: "yellow",
              height: "50px",
              marginBottom: "18px"
            }
          }}
          InputLabelProps={{
            shrink: true,
            style: {
              fontSize: '19px',
              color: textColor
            }
          }}
          variant="outlined"
          sx={{
            '& .MuiInputLabel-root': {
              fontWeight: 'bold',
            }
          }}
        />
      </Grid>
    </Grid>
  );
};

export default TextfieldWrapper;
