import React from 'react';
import { Button } from '@material-ui/core';
import { Edit as EditIcon, Delete as DeleteIcon, AddBox as AddBoxIcon } from '@mui/icons-material';
const ButtonWrapper = ({ label, name, isDisabled, handleclick, ...otherProps }) => {
  // name icon => del, edit, new
  const configIcon = {};
  const getIcon = (name) => {
    switch (name) {
      case 'new':
        return <AddBoxIcon {...configIcon} color="success" />;
      case 'edit':
        return <EditIcon {...configIcon} color={!isDisabled ? 'success' : ''} />;
      case 'del':
        return <DeleteIcon {...configIcon} color={!isDisabled ? 'error' : ''} />;
      default:
        return <></>;
    }
  };

  const configButton = {
    ...otherProps,
    variant: 'contained',
    color: 'primary',
    fullWidth: true,
    onClick: () => handleclick(name),
    disabled: isDisabled,
    size: 'large',
    sx: {
      marginInline: 2,
      '&.Mui-disabled': {
        backgroundColor: '#28304e',
        color: (theme) => theme.palette.primary.light
      }
    }
  };

  return (
    <Button {...configButton} startIcon={getIcon(name)}>
      {label}
    </Button>
  );
};

export default ButtonWrapper;
