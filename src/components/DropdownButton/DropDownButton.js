import React, { useState, useRef, useEffect } from 'react';
import { MenuList, MenuItem, Box, Button, Popper, Grow, Paper, Typography, Tooltip } from '@mui/material';
import {
  ExpandLess,
  AddCircle as AddCircleIcon,
  Add,
  Edit,
  Delete,
  Save,
  Restore,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const DropdownButton = ({ options, disabled, onSelect, buttonColor, iconName, width ,height,hoverText}) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(Array.isArray(options.actions) ? options.actions[0] : '');
  const anchorRef = useRef(null);

  const handleToggle = (e) => {
    if (!disabled) setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = () => {
    if (!disabled) setOpen(false);
  };

  const handleButtonTitle = (e, key) => {
    options.handler(options.actions[key]);
    setTitle(options.actions[key]);
    handleClose();
    onSelect && onSelect(options.actions[key]);
  };

  const handleSaveButton = (e) => {
    e.preventDefault();
    e.stopPropagation();
    options.handler(title);
  };

  const { isOpen, drawerWidth } = useSelector((state) => state.sidebar);

  const isButtonDisabled = disabled;
  let iconComponent;

  switch (iconName) {
    case 'ArrowForwardIosIcon':
      iconComponent = <ArrowForwardIosIcon sx={{ fontSize: '24px', color: '#fff' }} />;
      break;
    case 'ArrowBackIosIcon':
      iconComponent = <ArrowBackIosIcon sx={{ fontSize: '24px', color: '#fff' }} />;
      break;
    default:
      iconComponent = null;
  }

  return (
    <div style={{ margin: options.actions && options.actions.length === 0 && "0 30px" }}>
      <Tooltip title={hoverText} arrow>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            flexFlow: 'row wrap',
            alignItems: 'stretch',
            width: options.actions && options.actions.length === 1 ? '80px' : options.actions && options.actions.length === 0 ? "10px" : '180px',
            height: height? height:"40px",
            marginLeft: "7px",
            borderRadius: (theme) => theme.spacing(0, 0, 5, 5),
          }}
          ref={anchorRef}
        >
          <Button
            startIcon={iconComponent}
            onClick={handleSaveButton}
            disabled={isButtonDisabled}
            sx={{
              flexGrow: 8,
              borderRadius: (theme) =>
                options.actions.length < 2 ? theme.spacing(1, 1, 1, 1) : theme.spacing(1, 0, 0, 0),
              '&:hover': { backgroundColor: (theme) => theme.palette.secondary.dark },
              backgroundColor: isButtonDisabled ? '#28304e' : buttonColor || '#19a8e3',
              color: isButtonDisabled ? '#000' : '#fff',
              textAlign: "center",
              padding: "6px 4px",
              'span': { marginLeft: options.actions.length === 0 && "0", marginRight: options.actions.length === 0 && "0" }
            }}
          >
            {options.actions && options.actions.length > 0 &&
              <Typography variant="subtitle1" sx={{ fontWeight: "300", color: isButtonDisabled ? 'white' : 'white' }}>{title}</Typography>
            }
          </Button>
          {options.actions && options.actions.length > 1 && (
            <Button
              id="composition-button"
              aria-controls={open ? 'composition-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleToggle}
              disabled={isButtonDisabled}
              sx={{
                borderRadius: (theme) => theme.spacing(0, 1, 0, 0),
                flexGrow: 1,
                '&:hover': { backgroundColor: (theme) => theme.palette.secondary.dark },
                backgroundColor: isButtonDisabled ? '#28304e' : buttonColor || '#19a8e3',
                color: isButtonDisabled ? '#000' : '#fff',
              }}
            >
              <ExpandLess
                sx={[
                  {
                    transform: 'rotate(180deg)',
                    transition: 'transform .4s ease-in-out'
                  },
                  open && { transform: 'rotate(0deg)' }
                ]}
              />
            </Button>
          )}
        </Box>
      </Tooltip>

      <Popper
        onBlur={handleClose}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-start"
        transition
        disablePortal
        style={{ zIndex: 1000 }} // Add this line to set the zIndex
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom'
            }}
          >
            <Paper
              sx={{
                borderRadius: (theme) => theme.spacing(0, 0, 1, 1),
                width: anchorRef.current ? anchorRef.current.offsetWidth : null
              }}
            >
              <MenuList
                autoFocusItem={open}
                id="composition-menu"
                aria-labelledby="composition-button"
              >
                {options.actions &&
                  Array.isArray(options.actions) &&
                  options.actions.map((option, index) => (
                    <MenuItem
                      key={index}
                      value={option}
                      onClick={(e) => handleButtonTitle(e, index)}
                    >
                      {option}
                    </MenuItem>
                  ))}
              </MenuList>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
};

export default DropdownButton;
