import React, { useState } from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const CustomCheckbox = ({ checked, label, disabled }) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleChange = () => {
    if (!disabled) {
      setIsChecked(!isChecked);
    }
  };

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={isChecked}
          icon={<CancelIcon color="error" sx={{ fontSize: 32 }} />}
          checkedIcon={<CheckCircleIcon style={{ color: 'green', fontSize: 32 }} />}
          disableRipple
          onChange={handleChange}
          disabled={disabled}
        />
      }
      label={<span style={{ fontWeight: 'bold' }}>{label}</span>}
    />
  );
};

export default CustomCheckbox;
