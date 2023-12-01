import React, { useState } from 'react';
import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel } from '@material-ui/core';
import { useField, useFormikContext } from 'formik';
import { Typography } from '@mui/material';
import { useTheme } from '@material-ui/core';
import { useSelector } from 'react-redux';
const CheckboxWrapper = ({ name, label, legend, add, check, ...otherProps }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);
  const theme = useTheme();
  const [ch, setCh] = useState(check);
  const customization = useSelector((state) => state.config);
  const textColor = customization.isLight ? 'black' : 'white';

  const handleChange = (evt) => {
    const { checked } = evt.target;
    setCh((prev) => {
      setFieldValue(name, !prev);
      return !prev
    })
    if (add)
      add(name, checked);
    //  setFieldValue(name, check);
  };

  const configCheckbox = {
    ...field,
    onChange: handleChange,
    style: {
      color: textColor
    },
  };

  const configFormControl = {
    style: {
      color: textColor
    }
  };
  if (meta && meta.touched && meta.error) {
    configFormControl.error = true;
  }

  return (
    <FormControl {...configFormControl}>
      <FormLabel component="legend" ><Typography style={{ color: 'red' }}>{legend}</Typography></FormLabel>
      <FormGroup>
        <FormControlLabel control={<Checkbox checked={ch} {...configCheckbox} />} label={label} />
      </FormGroup>
    </FormControl>
  );
};

export default CheckboxWrapper;
