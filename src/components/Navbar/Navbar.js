import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleOpen } from '../../redux/Slices/Sidebar';
import { changeTheme } from '../../redux/Slices/Config';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import {
  IconButton,
  Typography,
  Toolbar,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';

import { styled } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';


const NavBar = ({ isOpen }) => {
  const { isLight } = useSelector((state) => state.config);
  const navStyles = {
    width: '100%',
    transition: 'width 0.3s ease',
    position: 'relative',
  };
  const Nav = styled(MuiAppBar)(({ theme }) => ({
    boxShadow: '0 0 0 0',
    backgroundColor: isLight?"#153d77":"#000",
  }));

  const dispatch = useDispatch();

  const handleToggle = () => {
    dispatch(toggleOpen());
  };


  const switchTheme = () => {
    dispatch(changeTheme(!isLight));
  };
  const mediaQuery = '@media (max-width: 900px)';
  const mediaQueryStyles = {
    [mediaQuery]: {
      width: '30%'
    },
  };
  const { drawerWidth } = useSelector((state) => state.sidebar);

  return (
    <Nav sx={{
      // width: '100%',
      //  width:location.pathname =="/general-ledger/transactions/journal"&&!isOpen?"95%": 
      //  location.pathname =="/general-ledger/transactions/journal"&&isOpen?"80%": "100%",
      transition: 'width 0.3s ease',
      position: 'relative',
      '@media (max-width: 900px)': {
        width: 
           isOpen && location.pathname == "/dashboard" ?
            `calc(100% - 250px)`:
              "100%"
      },
      '@media (max-width: 600px)': {
        width:"100%"
      },
    }}>
      <Toolbar sx={{padding:"12px"}}>
        <IconButton
          onClick={handleToggle}
          aria-label="menu"
          edge="start"
          size="large"
          sx={{ mr: 2, ...(isOpen && { display: 'block' }), color: "white",'@media (max-width: 576px)': {
            mr:0.5
          } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography component="div" sx={{ ml: 'auto', display:"flex" , alignItems:"center" }}>
          {/* <FormControlLabel
            control={<Switch onChange={switchTheme} color="default" checked={isLight} />}
          /> */}
          <DarkModeSwitch
            style={{ marginRight: '2rem',
            '@media (max-width: 576px)': {
              marginRight: '0.5rem'
            } }}
            checked={isLight}
            onChange={switchTheme}
            size={30}
            sunColor = {"gold"}
          />

          <ProfileSection />
        </Typography>
        <NotificationSection />
      </Toolbar>
    </Nav>
  );
};

const Navbar = () => {
  const { isOpen } = useSelector((state) => state.sidebar);

  return <NavBar isOpen={isOpen} />;
};

export default Navbar;
