import Navbar from '../components/Navbar/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';
import Footer from '../components/Footer/Footer';
import { styled } from '@mui/material/styles';
import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import CssBaseline from '@mui/material/CssBaseline';
import React from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { useEffect } from 'react';

const Mainlayout = () => {
  
  const location = useLocation();
  const { isOpen, drawerWidth } = useSelector((state) => state.sidebar);
  useEffect(() => {
    console.log('Current pathname:', location.pathname);
  }, [])
  const Main = styled('main')(({ theme }) => ({
    display: 'block',
    flexGrow: 1,
    zIndex: 1000,
    boxShadow: theme.spacing(0),
    mb: '100px',
    backgroundColor:theme.palette.mode ==="dark" && "#000"

  }));

  return (
    <>
      <Box
        sx={[
          {
            
            display: 'flex',
            transition: `margin-left 1s cubic-bezier(0, 0, 0.2, 1)`,
            marginLeft: `-${drawerWidth}px`,
            '@media (max-width: 768px)': {
            }
          },
          isOpen && {
            transition: `margin-left 1s cubic-bezier(0, 0, 0.2, 1)`,
            marginLeft: 0
          }
        ]}>
                  {/* <Suspense fallback="Loading..."> */}

        <CssBaseline />

        <Sidebar />

        <Main open={isOpen} sx={{width:location.pathname =="/general-ledger/transactions/journal"&&isOpen ? `81%`:
              location.pathname =="/general-ledger/transactions/journal"&&!isOpen && "84%"}}>
          <Navbar />
            <Box sx={{
              borderRadius:"0",
              '@media (max-width: 900px)': {
                width:
                isOpen && location.pathname.includes("/organization/company/Edit/")?
                "calc(100% - 117px)":
                    isOpen && location.pathname ==="/dashboard"?
                    'calc(100% + 25px)':
                    isOpen && location.pathname === "/general-ledger/transactions/journal"?
                    'calc(100% - 79px)'
                    :
                    !isOpen && location.pathname === '/general-ledger/transactions/journal'? 
                    'calc(100% - 66px)':
                     "100%",
              },
              '@media (max-width: 600px)': {
                width:   
                            isOpen && location.pathname.includes("/general-ledger/master-files/costcenter/edit")?
                            "calc(100% - 25px)":
                            isOpen && location.pathname.includes("/organization/company/add")?
                            "calc(100% - 0px)":
                            isOpen && location.pathname == ("/general-ledger/transactions/journal")?
                            'calc(100% - 136px)':
                            !isOpen && location.pathname == ("/general-ledger/transactions/journal")?
                            'calc(100% - 114px)':
                            "100%",
              }
            }}>
              <Outlet />
            </Box>


        </Main>
        {/* </Suspense> */}


      </Box >
      <Footer />
    </>
  );
};

export default Mainlayout;
