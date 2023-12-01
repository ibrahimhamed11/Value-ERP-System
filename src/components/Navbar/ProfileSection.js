import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  ClickAwayListener,
  Divider,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  Stack,
  Switch,
  Typography
} from '@mui/material';

// project imports
import MainCard from './MainCard';
import Transitions from './Transitions';
import { changeLang } from '../../redux/Slices/Config';
// assets
import { AccountCircle, Settings, ExitToApp } from '@mui/icons-material';
import User1 from '../Assets/Images/user.png'; // Replace this with the actual path to your image
import { useLogout } from '../../lib/auth';
// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
  const theme = useTheme();
  const logout = useLogout();
  const customization = useSelector((state) => state.customization) || {}; // Add default value as an empty object
  const navigate = useNavigate();

  const [notification, setNotification] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  /**
   * anchorRef is used on different components and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef(null);
  const handleLogout = async () => {
    logout.mutate();
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleListItemClick = (event, index, route = '') => {
    setSelectedIndex(index);
    handleClose(event);

    if (route && route !== '') {
      navigate(route);
    }
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);
  const { lang } = useSelector((state) => state.config);
  const [language,setLanguage] = useState(lang)
  const dispatch = useDispatch()
  function changeLanguage(){
    if(language == "en"){
      dispatch(changeLang("ar"))
      setLanguage("ar")
    }
    else{
      dispatch(changeLang("en"))
      setLanguage("en")
    }
  }
  return (
    <>
      <Chip
        sx={{
          height: '48px',
          alignItems: 'center',
          borderRadius: '27px',
          transition: 'all .2s ease-in-out',
          borderColor: 'transparent',
          backgroundColor: 'transparent',
          stroke: theme.palette.primary.light,
              fill: theme.palette.primary.light,
          '&[aria-controls="menu-list-grow"], &:hover': {
            borderColor: theme.palette.primary.main,
            background: `transparent !important`,
            color: "theme.palette.primary.light",
            '& svg': {
              stroke: theme.palette.primary.light,
              fill: theme.palette.primary.light
            }
          },
          '& .MuiChip-label': {
            lineHeight: 0,
            zIndex: 5
          }
        }}
       
        label={<Settings stroke={1.5} size="1.5rem" color={theme.palette.primary.main} />}
        variant="outlined"
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
      />

      <Popper
        sx={{ zIndex: 1000 }}
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 14]
              }
            }
          ]
        }}>
        {({ TransitionProps }) => (
          <Transitions in={open} {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  border={false}
                  elevation={16}
                  content={false}
                  boxShadow
                  shadow={theme.shadows[16]}>
                  <Box>
                    <Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Typography variant="h4">Good Morning,</Typography>
                        <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
                          Johne Doe
                        </Typography>
                      </Stack>

                    </Stack>

                  </Box>
                  <Box>

                    

                    <List
                      component="nav"
                      sx={{
                        width: '100%',
                        maxWidth: 350,
                        minWidth: 300,
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: '10px',
                        [theme.breakpoints.down('md')]: {
                          minWidth: '100%'
                        },
                        '& .MuiListItemButton-root': {
                          mt: 0.5
                        }
                      }}>
                      <ListItemButton
                        sx={{ borderRadius: `${customization.borderRadius}px` }}
                        selected={selectedIndex === 0}
                        onClick={(event) => handleListItemClick(event, 0, '#')}>
                        <ListItemIcon>
                          <Settings fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Grid container spacing={1} justifyContent="space-between">
                              <Grid item>
                                <Typography variant="body2">Account Setting</Typography>
                              </Grid>
                              
                            </Grid>
                          }
                        />
                      </ListItemButton>
                      <ListItemButton
                        sx={{ borderRadius: `${customization.borderRadius}px` }}
                        selected={selectedIndex === 1}
                        onClick={(event) => handleListItemClick(event, 1, '#')}>
                        <ListItemIcon>
                          <AccountCircle fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Grid container spacing={1} justifyContent="space-between">
                              <Grid item>
                                <Typography variant="body2">Profile</Typography>
                              </Grid>
                              
                            </Grid>
                          }
                        />
                      </ListItemButton>
                      <ListItemButton
                        sx={{ borderRadius: `${customization.borderRadius}px` }}
                        selected={selectedIndex === 1}
                        onClick={(event) => handleListItemClick(event, 1, '#')}>
                        <ListItemIcon>
                          <AccountCircle fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Grid container spacing={1} justifyContent="space-between">
                              <Grid item>
                                <Typography variant="body2">Change Language</Typography>
                              </Grid>
                              
                            </Grid>
                          }
                        />
                      </ListItemButton>



                      <ListItemButton
                        sx={{ borderRadius: `${customization.borderRadius}px` }}
                        selected={selectedIndex === 4}
                        onClick={handleLogout}>
                        <ListItemIcon>
                          <ExitToApp fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                         primary={<Typography variant="body2">logout</Typography>} />
                      </ListItemButton>
                    </List>
                  </Box>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </>
  );
};

export default ProfileSection;
