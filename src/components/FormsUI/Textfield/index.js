import React from 'react';
import { TextField, useTheme } from '@material-ui/core';
import { useField } from 'formik';
import { useSelector } from 'react-redux';

const Textfield = ({ name, ...otherProps }) => {
  const [field, meta] = useField(name);
  const theme = useTheme();
  const customization = useSelector((state) => state.config);
  const textColor = customization.isLight ? 'black' : 'white';

  const configTextfield = {
    ...field,
    ...otherProps,
    fullWidth: true,
    variant: 'outlined'
  };
  if (meta && meta.touched && meta.error) {
    configTextfield.error = true;
    configTextfield.helperText = meta.error;
  }

  return (
    <TextField
      {...configTextfield}
      InputProps={{
        readOnly: otherProps.readOnly,
        style: {
          fontWeight: 'bold',
          fontSize: '1.2rem',
          color:textColor,
          height:"50px",
          marginBottom:"18px"
        }
      }}
      sx={{
        borderColor: Boolean(meta.error) ? 'red' : undefined,
        input: otherProps.readOnly && { cursor: 'no-drop' }
      }}
      InputLabelProps={{
        style: {
          fontSize: '19px',
          color:textColor
        }
      }}
    />
  );
};

export default Textfield;
