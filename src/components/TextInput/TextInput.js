import React from 'react';
import TextField from '@mui/material/TextField';

const TextInput = ({ label, placeholder, value, onChange, errorText, error }) => {
  return (
    <TextField
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      error={error}
      helperText={errorText}
      variant="outlined"
      fullWidth
      style={{ borderColor: error ? 'red' : undefined }}
    />
  );
};

export default TextInput;
