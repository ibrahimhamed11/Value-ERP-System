import React, { useState, useEffect } from 'react';
import { Switch } from '@mui/material';

const CustomSwitch = ({ isEnabled, onChange, labelOn, labelOff, disabled }) => {
  const [isChecked, setIsChecked] = useState(isEnabled);
  useEffect(() => {
    console.log('data', isEnabled)
    setIsChecked(isEnabled);
  }, [isEnabled]);

  const handleChange = () => {
    const newChecked = !isChecked;
    setIsChecked(newChecked);

    // Notify parent component of the change
    onChange(newChecked);
  };

  return (
    <div>
      <Switch
        disabled={disabled}
        checked={isChecked}
        onChange={handleChange}
        color={isChecked ? 'success' : 'default'}
      />
      <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
        {isChecked ? labelOn : labelOff}
      </span>
    </div>
  );
};

export default CustomSwitch;
