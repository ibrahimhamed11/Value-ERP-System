import * as React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { jwtDecode } from 'jwt-decode';
import CardStatus from '../../../components/Card/Cardstatus';
import Example from '../../../components/table/Table'

import LineChart from '../../../components/Charts/LineChart';
import BarChart from '../../../components/Charts/BarChart';
import { GetUserById , getUser} from '../api/Dash';


import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useEffect } from 'react';


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.primary.main,
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  boxShadow: `${theme.spacing(0, 4, 6)} rgba(126, 142, 177, 0.12)`
}));



export const Dashboard = () => {


  const [userName, setUserName] = useState("")
  const { isOpen, drawerWidth } = useSelector((state) => state.sidebar);

  const salesTodayLabel = 'Sales Today';
  const salesPercentage = 25;
  const price = '7856';

  useEffect(() => {
    // const decodedToken = jwtDecode(JSON.parse(sessionStorage.getItem("value_token")).token)
    // GetUserById(decodedToken.id).then((res) => {
    //   setUserName(res.data.firstName + " " + res.data.lastName)
    // })
    getUser().then((res)=>{
      setUserName(res.data.firstName + " " + res.data.lastName)
    })

  }, [])



  return (
    <Box display="flex" flexDirection="column" sx={{
      backgroundColor: (theme) => theme.palette.mode === 'dark' ? "#000" : "#153d77", width: "100%",
      '@media (max-width: 900px)': {
        width: isOpen ? "calc(100% - 250px)" : "100%"
      }
    }}>
      <Typography variant="h1" sx={{ marginLeft: '30px', fontFamily: 'Roboto, sans-serif' }}>Welcome back, {userName}</Typography>
      <Grid container spacing={2} sx={{
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? "#141619" : "#f4f7fc",
      }}>

        <Box sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          width: isOpen ? `calc(100% - 250px)` : "100%"
        }}>

          <LineChart />
          <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            width: isOpen ? `calc(50% - 125px)` : "50%",
            right: "20px",
            top: "230px;",
            position: "absolute",
            '@media (max-width: 900px)': {
              top: "600px",
              width: isOpen ? `calc(89% - 250px)` : "89%",
              right: "40px",
            }
          }}>
            <CardStatus
              headTitle={"companies"}
              price={65}
              percentageText={`${salesPercentage}%`}
            />
            <CardStatus
              headTitle={"branches"}
              price={55}
              percentageText={`${salesPercentage}%`}
            />
            <CardStatus
              headTitle={"GLAcount"}
              price={74}
              percentageText={`${salesPercentage}%`}
            />
            <CardStatus
              headTitle={"CostCenter"}
              price={44}
              percentageText={`${salesPercentage}%`}
            />
          </Box>
        </Box>
        {/* <Grid item xs={12} md={6}>
          <Item>
          </Item>
        </Grid>
        <Grid item xs={12} md={6} sx={{
          position: "absolute",
          top: "210px",
          right: isOpen ? "-80px" : "30px",
          '@media (max-width: 900px)': {
            top: "500px",
            marginTop: "100px",
            left: "20px",
            width: "100%"
          }
        }}>
          <Item sx={{
            width: isOpen ? `calc(100% - ${drawerWidth}px/2)` : '100%',
            transition: "width 1s"
          }}>
            <Grid container>
              <Grid item md={6} xs={12} >
                <Item >



                  <CardStatus
                    headTitle={salesTodayLabel}
                    price={price}
                    percentageText={`${salesPercentage}%`}
                  />



                </Item>
              </Grid>{' '}
              <Grid item xs={6}>
                <Item>
                  <CardStatus
                    headTitle={salesTodayLabel}
                    price={price}
                    percentageText={`${salesPercentage}%`}
                  />
                </Item>
              </Grid>{' '}
              <Grid item xs={6}>
                <Item>
                  <CardStatus
                    headTitle={salesTodayLabel}
                    price={price}
                    percentageText={`${salesPercentage}%`}
                  />
                </Item>
              </Grid>{' '}
              <Grid item xs={6}>
                <Item>
                  <CardStatus
                    headTitle={salesTodayLabel}
                    price={price}
                    percentageText={`${salesPercentage}%`}
                  />
                </Item>
              </Grid>
            </Grid>
          </Item>
        </Grid> */}
        <Grid container sx={{
          marginTop: "430px",
          '@media (max-width: 900px)': {
            marginTop: "700px"
          }
        }}>
          {/* <Grid container>
          <Grid item md={isOpen ? 7 : 8} xs={12}>
            <Item>
              <Example />
            </Item>
          </Grid>
          <Grid item md={isOpen ? 5 : 4} xs={12}>
            <Item>
              <BarChart />
            </Item>
          </Grid>
          </Grid> */}
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
          <Example />
          <BarChart />
        </Box>
        <Grid item xs={3}>
          <Item>
            {/* <DoughnutChart /> */}
          </Item>
        </Grid>
        <Grid item xs={8}>
          <Item>
            {/* <DataGridChart /> */}
          </Item>
        </Grid>
        <Grid item xs={4}>
          <Item>
            {/* <BarChart /> */}
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
};
