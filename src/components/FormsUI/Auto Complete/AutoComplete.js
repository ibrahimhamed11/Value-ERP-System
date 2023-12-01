import React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { styled, useTheme } from '@mui/material';

const CustomTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    height: '50px'
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderRadius: '5px'
  },
  '& .MuiInputBase-input': {
    fontSize: '20px',
    fontWeight: 'bold',
    color: theme.palette.mode === 'dark' ? 'white' : 'black',
  },
}));

export default function ComboBox({ options, name, values, onChange, label , value}) {
  const theme = useTheme();
  return (
    <Autocomplete
      options={options}
      value={values}
      onChange={onChange}
      getOptionLabel={(option) => option}
      renderInput={(params) => (
        <CustomTextField
          {...params}
          name={name}
          label={label}
          InputProps={{
            ...params.InputProps,
            style: {
              backgroundColor: 'transparent',

            },
          }}
          InputLabelProps={{
            style: {
              fontSize: '19px',
              color: theme.palette.mode === 'dark' ? 'white' : 'black',
              // backgroundColor: theme.palette.mode !== 'dark' ? 'white' : 'black',
              // backgroundColor:"transparent"
              backgroundColor:"white",
              paddingRight:"5px"
            },
          }}
        />
      )}
    />
  );
}
