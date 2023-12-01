import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';

const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const amtData = [2400, 2210, 2290, 2000, 2181, 2500, 2100];
const xLabels = [
  'Page A',
  'Page B',
  'Page C',
  'Page D',
  'Page E',
  'Page F',
  'Page G',
];

export default function StackedAreaChart() {
  const { isOpen, drawerWidth } = useSelector((state) => state.sidebar);
  return (
    <Box sx={{
      backgroundColor:(theme)=>
    theme.palette.mode === 'light' ? "#fff" : "#1E1E1E",
      // backgroundColor: "white",
      width: isOpen?`calc(45% - 125px)`:"45%",
      position: "absolute",
      top: "230px",
      transition: `width 1s cubic-bezier(0, 0, 0.2, 1)`,
      left: isOpen ? `270px` : "33px",
      borderRadius:"3px",
      boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
      overflow:"hidden",
      '@media (max-width: 900px)':{
        width: isOpen ? `65%` : "85%",
      }
    }}>
      <LineChart
        // width={500}
        height={320}
        series={[
          { data: uData, label: 'uv', area: true, stack: 'total', showMark: false, color: "#19a8e3" },
          { data: pData, label: 'pv', area: true, stack: 'total', showMark: false, color:'#00e676' },
          {
            data: amtData,
            label: 'amt',
            area: true,
            stack: 'total',
            showMark: false,
            color:"#f44336"
          },

        ]}
        xAxis={[{ scaleType: 'point', data: xLabels }]}
        sx={{
          '.MuiLineElement-root': {
            display: 'none',
          },
          width: "100%",
          color:"white",
          '& text':{
            fill:(theme)=>theme.palette.mode =="dark"&&"#fff"
          },
          '& .MuiChartsAxis-line': {
            stroke: (theme)=>theme.palette.mode =="dark"&&"#fff", 
          },
          
        }}
      />
    </Box>
  );
}