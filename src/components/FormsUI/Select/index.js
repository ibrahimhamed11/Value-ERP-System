import React from 'react';
import { TextField, MenuItem ,  makeStyles } from '@material-ui/core';
import { useField, useFormikContext } from 'formik';
import { useTheme } from '@material-ui/core';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  menuPaper: {
    maxHeight: 100
  }
}));
const SelectWrapper = ({ name, options, valueType = 'string', onChange, ...otherProps }) => {
  const classes = useStyles();
  const [field, meta] = useField(name);
  const theme = useTheme();
  const customization = useSelector((state) => state.config);
  const textColor = customization.isLight ? 'black' : 'white';

  const { setFieldValue, values } = useFormikContext();

  const handleChange = (evt) => {
    let { value } = evt.target;

    // Convert the value to a number if valueType is 'number'
    if (valueType === 'number') {
      value = parseInt(value, 10);
    }

    setFieldValue(name, value);

    if (onChange) {
      onChange(evt);
    }
  };

  const configSelect = {
    ...field,
    ...otherProps,
    select: true,
    variant: 'outlined',
    fullWidth: true,
    onChange: handleChange,
    InputProps: {
      style: { height: '60px' },
      
      
    },
    MenuProps: {
      PaperProps: {
        style: { maxHeight: '50px' }, // Adjust the maxHeight to change the menu's height
      },
    },
    
  };

  if (valueType === 'number') {
    // Set the input type to 'number' if valueType is 'number'
    configSelect.type = 'number';
  }

  if (meta && meta.touched && meta.error) {
    configSelect.error = true;
    configSelect.helperText = meta.error;
  }

  const selectedNameEn = options[values[name]] || ''; // Get the English name of the selected category

  return (
    <>
      <TextField
        {...configSelect}
        InputLabelProps={{ style: { fontSize: "17px", color: textColor } }}
      >
        {Object.keys(options).map((item, pos) => {
          return (
            <MenuItem key={pos} value={item}>
              {options[item]}
            </MenuItem>
          );
        })}
      </TextField>
    </>
  );
};

export default SelectWrapper;
