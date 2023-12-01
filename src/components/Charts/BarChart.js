import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';


const data = [
  { value: 5, label: 'A' },
  { value: 10, label: 'B' },
  { value: 15, label: 'C' },
  { value: 20, label: 'D' },
];

const size = {
  width: 1200,
  height: 430
};

const StyledText = styled('text')(({ theme }) => ({
  fill: theme.palette.mode === 'dark' ? "#fff" : theme.palette.primary.main,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontSize: 20,
}));

function PieCenterLabel({ children }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

export default function PieChartWithCenterLabel() {
  const { isOpen, drawerWidth } = useSelector((state) => state.sidebar);
  size.width = isOpen ? 500 - (drawerWidth / 2) : 410

  return (
<Box sx={{marginRight:isOpen?"170px":"150px",width:"22%",
'@media (max-width: 1200px)': {
  marginRight:isOpen?"460px": "440px",
    width: "0%"
},
'@media (max-width: 900px)': {
  marginLeft:isOpen?"20%":"30%"
},
'@media (max-width: 600px)': {
  marginLeft:isOpen?"7%":"12%"
},
}}>
    <PieChart sx={{
     backgroundColor:(theme)=> theme.palette.mode === 'light' ? "#fff" : "#1E1E1E",
      boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
      // marginRight:isOpen?"80px":"80px",
      padding:"19px 10px 19px 60px",
      
    }} series={[{ data, innerRadius: 80 }]} {...size} labelStyle={{ fill: 'red' }} >
      <PieCenterLabel sx={{ backgroundColor: "white",
          '& .MuiChartsLegend-label':{
            fill:(theme)=>theme.palette.mode =="dark"&&"#fff"
          }, }}>Center label</PieCenterLabel>
    </PieChart>
    </Box>
  );
}
