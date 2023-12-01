import {
  ListItemButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  Avatar,
  Typography,
  Toolbar,
  Box
} from '@mui/material';
import { Link } from 'react-router-dom';
import { LogoIcon } from '../../components/Assets/Images/LogoIcon.js';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useSelector, useDispatch } from 'react-redux';
import { SvgIcon } from '@mui/material';
import { toggleOpen } from '../../redux/Slices/Sidebar';
import { styled, useTheme } from '@mui/material/styles';
import { Analytics as AnalyticsIcon } from '@mui/icons-material';

import HomeIcon from '@mui/icons-material/Home';
import ExpandLess from '@mui/icons-material/ExpandLess';
import Collapse from '@mui/material/Collapse';
import { useState } from 'react';
import {
  DriveFolderUpload as DriveFolderUploadIcon,
  InsertChart as InsertChartIcon,
  LibraryBooks as LibraryBooksIcon,
  BarChart as BarChartIcon,
  CallSplit as CallSplitIcon,
  Warehouse as WarehouseIcon,
  House as HouseIcon,
  EmojiObjects as EmojiObjectsIcon,
  DoorSliding as DoorSlidingIcon,
  Pinch as PinchIcon,
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  Apartment as ApartmentIcon,
  Settings as RoleIcon,
  Security as SecurityIcon,
  Group as UserIcon,

} from '@mui/icons-material';


import avatarb2554d38 from '../Assets/Images/user.png';


const getIcon = (name) => {
  switch (name) {
    case 'Branches':
      return <BusinessIcon />;
    case 'Role':
      return <RoleIcon />;
    case 'User':
      return <UserIcon />;
    case 'Security':
      return <SecurityIcon />;
    case 'Companies':
      return <ApartmentIcon />;
    case 'Organization':
      return <HomeIcon />;
    case 'Dashboard':
      return <DashboardIcon />;
    case 'General Ledger Reports':
      return <InsertChartIcon />;
    case 'General Ledger':
      return <LibraryBooksIcon />;
    case 'General Ledger Master Files':
      return <DriveFolderUploadIcon />;
    case 'General Ledger Transactions':
      return <DriveFolderUploadIcon />;
    case 'General Ledger Queries':
      return <DriveFolderUploadIcon />;
    case 'General Ledger Chart':
      return <BarChartIcon />;
    case 'General Consolidated Chart':
      return <CallSplitIcon />;
    case 'Cost Centers':
      return <WarehouseIcon />;
    case 'Cost Center':
      return <HouseIcon />;
    case 'Projects':
      return <EmojiObjectsIcon />;

    case 'Journal Entries':
      return <DoorSlidingIcon />;
    case 'Pre Payment and Accrual Entry':
      return <PinchIcon />;
    default:
      return <HomeIcon />;
  }
};

const SidebarComponent = (prop) => {
  const [isOpenGL, setOpenGL] = useState(false);
  const [isOpenGLMF, setOpenGLMF] = useState(false);
  const [isOpenCS, setOpenCS] = useState(false);
  const [isOpenGLT, setOpenGLT] = useState(false);
  const [isOpenGLQ, setOpenGLQ] = useState(false);
  const [isOpenOr, setOpenOr] = useState(false);
  const [isOpenRole, setOpenRole] = useState(false);
  const DrawerHeader = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.main,
    padding: "1.7rem",
    display: 'flex',
    justifyContent: 'start'
  }));
  const { isOpen, drawerWidth } = useSelector((state) => state.sidebar);
  const { isLight } = useSelector((state) => state.config);

  const dispatch = useDispatch();
  const handleToggle = () => {
    dispatch(toggleOpen());
  };
  const handleGLToggle = () => {
    setOpenGL(!isOpenGL);
  };
  const handleGLMFToggle = () => {
    setOpenGLMF(!isOpenGLMF);
  };
  const handleCSToggle = () => {
    setOpenCS(!isOpenCS);
  };
  const handleGLTToggle = () => {
    setOpenGLT(!isOpenGLT);
  };
  const handleGLQToggle = () => {
    setOpenGLQ(!isOpenGLQ);
  };
  const handleOrToggle = () => {
    setOpenOr(!isOpenOr);
  };
  const handleRoleToggle = () => {
    setOpenRole(!isOpenRole);
  };

  return (
    <Drawer
      open={isOpen}
      anchor={'left'}
      transitionDuration={{
        enter: 0,
        exit: 0
      }}
      sx={{
        width: `${drawerWidth}px`,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          borderRight: "0px solid transparent",
          boxSizing: 'border-box',
          position: 'sticky',
          minHeight: "100vh",
          backgroundColor: (theme) => theme.palette.mode == "dark" && "#000",
        }
      }}
      variant="persistent">
      <DrawerHeader sx={{ backgroundColor: (theme) => theme.palette.mode == "dark" ? "#000" : "#153d77",paddingRight:"2px",height:'178px' }}>
        <Box
          sx={{
            justifyContent: 'center',
            alignItems: 'center',

          }}>
          <Link to="/">
            <LogoIcon isLight={isLight} />
          </Link>
        </Box>
      </DrawerHeader>


      <Box
        sx={{
          flexDirection: 'column',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 100,
          backgroundColor: (theme) => theme.palette.mode == "dark" && "#000"
        }}>
        <Avatar
          src={avatarb2554d38}
          variant="circular"
          sx={{ minHeight: 80, minWidth: 80, marginTop: 3 }}
        />
        <Typography
          variant="logo"
          component="div"
          sx={{
            display: 'block',
            marginTop: 3,
            color: (theme) => theme.palette.mode == "light" ? theme.palette.primary.dark : "white",
            fontFamily: 'Roboto, sans-serif'
          }}>

          Welcome
        </Typography>{' '}
        <Typography
          variant="subtitle2"
          component="div"
          sx={{
            display: 'block',

            color: (theme) => theme.palette.primary.dark,
            fontWeight: 100
          }}>
        </Typography>
      </Box>

      <List
        sx={{
          width: '100%',
          maxWidth: 360,
          color: (theme) => theme.palette.mode == "dark" && "white"
        }}
        component="nav">
        <ListItem key={0}>
          <Typography variant="smallText" component="div" sx={{ pl: 0 }}>
            Main
          </Typography>
        </ListItem>
        <ListItem key={1} disablePadding>
          <Link to="dashboard">
            <ListItemButton sx={{
              '&:hover': {
                backgroundColor: (theme) => theme.palette.mode == "dark" && "#4c3838"
              }
            }}>
              <ListItemIcon sx={{ color: (theme) => theme.palette.mode == "dark" && "white" }}>{getIcon('Dashboard')}</ListItemIcon>
              <ListItemText
                sx={{ color: (theme) => theme.palette.mode == "dark" && "white" }}
                disableTypography
                primaryTypographyProps={{ variant: 'mediumText' }}
                primary={'Dashboard'}
              />
            </ListItemButton>
          </Link>
        </ListItem>
        <ListItem key={2} disablePadding>
          <ListItemButton sx={{
            '&:hover': {
              backgroundColor: (theme) => theme.palette.mode == "dark" && "#4c3838"
            }
          }} onClick={handleOrToggle}>
            <ListItemIcon sx={{ color: (theme) => theme.palette.mode == "dark" && "white" }}>{getIcon('Organization')}</ListItemIcon>
            <ListItemText
              sx={{ color: (theme) => theme.palette.mode == "dark" && "white" }}
              disableTypography
              primaryTypographyProps={{ variant: 'mediumText' }}
              primary="Organization"
            />
            <ExpandLess
              sx={[
                {
                  transform: 'rotate(90deg)',
                  transition: 'transform .4s ease-in-out'
                },
                isOpenOr && { transform: 'rotate(180deg)' }
              ]}
            />
          </ListItemButton>
          <Collapse in={isOpenOr} timeout="auto" unmountOnExit orientation="vertical" sx={{backgroundColor:"#cecbcb"}}>
            <List component="div">
              <ListItem key={0} disablePadding>
                <Link to={`organization/company`}>
                  <ListItemButton sx={{
                    pl: 4, '&:hover': {
                      backgroundColor: (theme) => theme.palette.mode == "dark" && "#4c3838"
                    }
                  }} onClick={handleGLMFToggle}>
                    <ListItemIcon sx={{ color: (theme) => theme.palette.mode == "dark" && "gery" }}>{getIcon('Companies')}</ListItemIcon>

                    <ListItemText sx={{ color: (theme) => theme.palette.mode == "dark" && "gery" }} primary="Companies" />
                  </ListItemButton>
                </Link>
              </ListItem>
              <ListItem key={1} disablePadding>
                <Link to={`organization/branch`}>
                  <ListItemButton sx={{
                    pl: 4, '&:hover': {
                      backgroundColor: (theme) => theme.palette.mode == "dark" && "#4c3838"
                    }
                  }} onClick={handleGLMFToggle}>
                    <ListItemIcon sx={{ color: (theme) => theme.palette.mode == "dark" && "gery" }}>{getIcon('Branches')}</ListItemIcon>
                    <ListItemText sx={{ color: (theme) => theme.palette.mode == "dark" && "grey" }} primary="Branches" />
                  </ListItemButton>
                </Link>
              </ListItem>
            </List>
          </Collapse>
        </ListItem>
        <ListItem key={3} disablePadding>
          <ListItemButton sx={{
            '&:hover': {
              backgroundColor: (theme) => theme.palette.mode == "dark" && "#4c3838"
            }
          }} onClick={handleGLToggle}>
            <ListItemIcon sx={{ color: (theme) => theme.palette.mode == "dark" && "white" }}>{getIcon('General Ledger')}</ListItemIcon>
            <ListItemText
              sx={{ color: (theme) => theme.palette.mode == "dark" && "white" }}
              disableTypography
              primaryTypographyProps={{ variant: 'mediumText' }}
              primary="General Ledger"
            />
            <ExpandLess
              sx={[
                {
                  transform: 'rotate(90deg)',
                  transition: 'transform .3s ease-in-out'
                },
                isOpenGL && { transform: 'rotate(180deg)' }
              ]}
            />
          </ListItemButton>
          <Collapse in={isOpenGL} timeout="auto" unmountOnExit orientation="vertical" sx={{backgroundColor:"#cecbcb"}}>
            <List component="div" disablePadding>
              <ListItem key={0} disablePadding>
                <ListItemButton sx={{
                  pl: 4, '&:hover': {
                    backgroundColor: (theme) => theme.palette.mode == "dark" && "#4c3838"
                  }
                }} onClick={handleGLMFToggle}>
                  <ListItemIcon sx={{ color: (theme) => theme.palette.mode == "dark" && "white" }}>{getIcon('General Ledger Master Files')}</ListItemIcon>
                  <ListItemText sx={{ color: (theme) => theme.palette.mode == "dark" && "white" }} primary="General Ledger Master Files" />
                  <ExpandLess
                    sx={[
                      {
                        transform: 'rotate(90deg)',
                        transition: 'transform .3s ease-in-out'
                      },
                      isOpenGLMF && { transform: 'rotate(180deg)' }
                    ]}
                  />
                </ListItemButton>
                <Collapse in={isOpenGLMF} timeout="auto" unmountOnExit orientation="vertical" sx={{backgroundColor:"#cecbcb"}}>
                  <List component="div" disablePadding>
                    <ListItem key={0} disablePadding>
                      <Link to={`general-ledger/master-files/GL-Account`}>
                        <ListItemButton sx={{
                          pl: 6, '&:hover': {
                            backgroundColor: (theme) => theme.palette.mode == "dark" && "#4c3838"
                          }
                        }}>
                          <ListItemIcon sx={{ color: (theme) => theme.palette.mode == "dark" && "white" }}>{getIcon('General Ledger Chart')}</ListItemIcon>
                          <ListItemText sx={{ color: (theme) => theme.palette.mode == "dark" && "white" }} primary="General Ledger Chart" />
                        </ListItemButton>
                      </Link>
                    </ListItem>


                    {/* 
                    <ListItem key={1} disablePadding>
                      <Link to={`general-ledger/master-files/consolidated-chart`}>
                        <ListItemButton sx={{
                          pl: 6, '&:hover': {
                            backgroundColor: (theme) => theme.palette.mode == "dark" && "#4c3838"
                          }
                        }}>
                          <ListItemIcon sx={{ color: (theme) => theme.palette.mode == "dark" && "white" }}>{getIcon('General Consolidated Chart')}</ListItemIcon>
                          <ListItemText sx={{ color: (theme) => theme.palette.mode == "dark" && "white" }} primary="General Consolidated Chart" />
                        </ListItemButton>
                      </Link>

                    </ListItem> */}










                    <ListItem key={2} disablePadding>
                      <Link to={`general-ledger/master-files/costcenter`}>
                        <ListItemButton sx={{
                          pl: 6, '&:hover': {
                            backgroundColor: (theme) => theme.palette.mode == "dark" && "#4c3838"
                          }
                        }} onClick={handleCSToggle}>
                          <ListItemIcon sx={{ color: (theme) => theme.palette.mode == "dark" && "white" }}>{getIcon('Cost Centers')}</ListItemIcon>
                          <ListItemText sx={{ color: (theme) => theme.palette.mode == "dark" && "white" }} primary="Cost Centers" />

                          {/* <ExpandLess
                          sx={[
                            {
                              transform: "rotate(90deg)",
                              transition: "transform .4s ease-in-out",
                            },
                            isOpenCS && { transform: "rotate(180deg)" },
                          ]}
                        />*/}
                        </ListItemButton>
                      </Link>
                      {/* <Collapse
                        in={isOpenCS}
                        timeout="auto"
                        unmountOnExit
                        orientation="vertical"
                      >
                        <List component="div" disablePadding>
                          <ListItem key={0} disablePadding>
                            <Link to={`general-ledger/consolidated-chart`}>
                              <ListItemButton sx={{ pl: 8 }}>
                                <ListItemIcon>
                                  {getIcon("Cost Center")}
                                </ListItemIcon>
                                <ListItemText primary="Cost Center 1" />
                              </ListItemButton>
                            </Link>
                          </ListItem>
                          <ListItem key={0} disablePadding>
                            <Link to={`gl/cost-center/:2`}>
                              <ListItemButton sx={{ pl: 8 }}>
                                <ListItemIcon>
                                  {getIcon("Cost Center")}
                                </ListItemIcon>
                                <ListItemText primary="Cost Center 2" />
                              </ListItemButton>
                            </Link>
                          </ListItem>
                        </List>
                      </Collapse> */}
                    </ListItem>



                    <ListItem key={1} disablePadding>
                      <Link to={`general-ledger/master-files/CostCenterCategory`}>
                        <ListItemButton sx={{
                          pl: 6, '&:hover': {
                            backgroundColor: (theme) => theme.palette.mode == "dark" && "#4c3838"
                          }
                        }}>
                          <ListItemIcon sx={{ color: (theme) => theme.palette.mode == "dark" && "white" }}>{getIcon('Cost Center Category')}</ListItemIcon>
                          <ListItemText sx={{ color: (theme) => theme.palette.mode == "dark" && "white" }} primary="Cost Center Category" />
                        </ListItemButton>
                      </Link>





                    </ListItem>
                    {/* 
                    <ListItem key={3} disablePadding>
                      <Link to="general-ledger/master-files/project">
                        <ListItemButton sx={{
                          pl: 6, '&:hover': {
                            backgroundColor: (theme) => theme.palette.mode == "dark" && "#4c3838"
                          }
                        }}>
                          <ListItemIcon sx={{ color: (theme) => theme.palette.mode == "dark" && "white" }}>{getIcon('Projects')}</ListItemIcon>
                          <ListItemText sx={{ color: (theme) => theme.palette.mode == "dark" && "white" }} primary="Projects" />
                        </ListItemButton>
                      </Link>
                    </ListItem> */}
                  </List>
                </Collapse>
              </ListItem>
              <ListItem key={1} disablePadding>
                <ListItemButton sx={{
                  pl: 4, '&:hover': {
                    backgroundColor: (theme) => theme.palette.mode == "dark" && "#4c3838"
                  }
                }} onClick={handleGLTToggle}>
                  <ListItemIcon sx={{ color: (theme) => theme.palette.mode == "dark" && "white" }}>{getIcon('General Ledger Transactions')}</ListItemIcon>
                  <ListItemText sx={{ color: (theme) => theme.palette.mode == "dark" && "white" }} primary="General Ledger Transactions" />
                  <ExpandLess
                    sx={[
                      {
                        transform: 'rotate(90deg)',
                        transition: 'transform .3s ease-in-out'
                      },
                      isOpenGLT && { transform: 'rotate(180deg)' }
                    ]}
                  />
                </ListItemButton>
                <Collapse in={isOpenGLT} timeout="auto" unmountOnExit orientation="vertical" sx={{backgroundColor:"#cecbcb"}}>
                  <List component="div" disablePadding>
                    <ListItem key={0} disablePadding>
                      <Link to={`general-ledger/transactions/journal`}>
                        <ListItemButton sx={{
                          pl: 6, '&:hover': {
                            backgroundColor: (theme) => theme.palette.mode == "dark" && "#4c3838"
                          }
                        }}>
                          <ListItemIcon sx={{ color: (theme) => theme.palette.mode == "dark" && "white" }}>{getIcon('Journal Entries')}</ListItemIcon>
                          <ListItemText sx={{ color: (theme) => theme.palette.mode == "dark" && "white" }} primary="Journal Entries" />
                        </ListItemButton>
                      </Link>
                    </ListItem>


                    {/* 

                    <ListItem key={1} disablePadding>
                      <Link to={`general-ledger/transactions/pre-payment-and-accrual-entry`}>
                        <ListItemButton sx={{
                          pl: 6, '&:hover': {
                            backgroundColor: (theme) => theme.palette.mode == "dark" && "#4c3838"
                          }
                        }}>
                          <ListItemIcon sx={{ color: (theme) => theme.palette.mode == "dark" && "white" }}>{getIcon('Pre Payment and Accrual Entry')}</ListItemIcon>
                          <ListItemText sx={{ color: (theme) => theme.palette.mode == "dark" && "white" }} primary="Pre Payment and Accrual Entry" />
                        </ListItemButton>
                      </Link>
                    </ListItem>
 */}


                  </List>
                </Collapse>
              </ListItem>

              {/* 

              <ListItem key={2} disablePadding>
                <ListItemButton sx={{
                  pl: 4, '&:hover': {
                    backgroundColor: (theme) => theme.palette.mode == "dark" && "#4c3838"
                  }
                }} onClick={handleGLQToggle}>
                  <ListItemIcon sx={{ color: (theme) => theme.palette.mode == "dark" && "white" }}>{getIcon('General Ledger Queries')}</ListItemIcon>
                  <ListItemText sx={{ color: (theme) => theme.palette.mode == "dark" && "white" }} primary="General Ledger Queries" />
                  <ExpandLess
                    sx={[
                      {
                        transform: 'rotate(90deg)',
                        transition: 'transform .3s ease-in-out'
                      },
                      isOpenGLQ && { transform: 'rotate(180deg)' }
                    ]}
                  />
                </ListItemButton>
                <Collapse in={isOpenGLQ} timeout="auto" unmountOnExit orientation="vertical">
                  <List component="div" disablePadding>
                    <ListItem key={0} disablePadding>
                      <Link to={`general-ledger/queries/accounts-details-queries`}>
                        <ListItemButton sx={{
                          pl: 6, '&:hover': {
                            backgroundColor: (theme) => theme.palette.mode == "dark" && "#4c3838"
                          }
                        }}>
                          <ListItemIcon sx={{ color: (theme) => theme.palette.mode == "dark" && "white" }}>{getIcon('Accounts Details Queries')}</ListItemIcon>
                          <ListItemText sx={{ color: (theme) => theme.palette.mode == "dark" && "white" }} primary="Accounts Details Queries" />
                        </ListItemButton>
                      </Link>
                    </ListItem>
                  </List>
                </Collapse>
              </ListItem> */}

              {/* 

              <ListItem key={3} disablePadding>
                <Link to={`general-ledger/reports`}>
                  <ListItemButton sx={{
                    pl: 4, '&:hover': {
                      backgroundColor: (theme) => theme.palette.mode == "dark" && "#4c3838"
                    }
                  }}>
                    <ListItemIcon sx={{ color: (theme) => theme.palette.mode == "dark" && "white" }}>{getIcon('General Ledger Reports')}</ListItemIcon>
                    <ListItemText sx={{ color: (theme) => theme.palette.mode == "dark" && "white" }} primary="General Ledger Reports" />
                  </ListItemButton>
                </Link>
              </ListItem> */}
            </List>
          </Collapse>
        </ListItem>
      </List>
      <ListItem key={2} disablePadding>
        <ListItemButton sx={{
          '&:hover': {
            backgroundColor: (theme) => theme.palette.mode == "dark" && "#4c3838"
          }
        }} onClick={handleRoleToggle}>
          <ListItemIcon sx={{ color: (theme) => theme.palette.mode == "dark" && "white" }}>{getIcon('Security')}</ListItemIcon>
          <ListItemText
            sx={{ color: (theme) => theme.palette.mode == "dark" && "white" }}
            disableTypography
            primaryTypographyProps={{ variant: 'mediumText' }}
            primary="Administration"
          />
          <ExpandLess
            sx={[
              {
                transform: 'rotate(90deg)',
                transition: 'transform .4s ease-in-out'
              },
              isOpenRole && { transform: 'rotate(180deg)' }
            ]}
          />
        </ListItemButton>
        <Collapse in={isOpenRole} timeout="auto" unmountOnExit orientation="vertical" sx={{backgroundColor:"#cecbcb"}}>
          <List component="div">
            <ListItem key={3} disablePadding>
              <Link to={`administration/role`}>
                <ListItemButton sx={{
                  pl: 4, '&:hover': {
                    backgroundColor: (theme) => theme.palette.mode == "dark" && "#4c3838"
                  }
                }}>
                  <ListItemIcon sx={{ color: (theme) => theme.palette.mode == "dark" && "white" }}>{getIcon('Role')}</ListItemIcon>
                  <ListItemText sx={{ color: (theme) => theme.palette.mode == "dark" && "white" }} primary="Roles" />
                </ListItemButton>
              </Link>
            </ListItem>
            <ListItem key={1} disablePadding>
              <Link to={`administration/user`}>
                <ListItemButton sx={{
                  pl: 4, '&:hover': {
                    backgroundColor: (theme) => theme.palette.mode == "dark" && "#4c3838"
                  }
                }} onClick={handleGLMFToggle}>
                  <ListItemIcon sx={{ color: (theme) => theme.palette.mode == "dark" && "white" }}>{getIcon('User')}</ListItemIcon>
                  <ListItemText sx={{ color: (theme) => theme.palette.mode == "dark" && "white" }} primary="Users" />
                </ListItemButton>
              </Link>
            </ListItem>
          </List>
        </Collapse>
      </ListItem>


      <Divider />

    </Drawer>
  );
};
export default SidebarComponent;
