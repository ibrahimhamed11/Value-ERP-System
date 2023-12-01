import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';

// function Copyright() {
//   return (
//     <Typography variant="body2" color="text.secondary">
//       {'Copyright © '}
//       <Link color="inherit" href="https://mui.com/">
//         Your Website
//       </Link>{' '}
//       {new Date().getFullYear()}
//       {'.'}
//     </Typography>
//   );
// }


export default function Footer() {
  const { isOpen, drawerWidth } = useSelector((state) => state.sidebar);
  const Nav = styled(NavLink)(({ theme }) => ({
    color: theme.palette.mode == "dark"?"white":theme.palette.text.secondary,
    textDecoration:"none",
    marginRight:"20px",
    fontSize:"15px"

  }));
  const Typo = styled(Typography)(({ theme }) => ({
    color: theme.palette.mode == "dark"?"white":theme.palette.text.secondary,
    fontSize:"15px"

  }));
  return (
    <Box sx={
      {
        backgroundColor:(theme)=>theme.palette.mode == "dark"&&"#141619",
        display: 'flex',
        justifyContent:"space-between",
        transition: `width 1s cubic-bezier(0, 0, 0.2, 1)`,
        padding:"20px",
        width:isOpen?`calc(99% - ${drawerWidth})`:"100%",
        paddingLeft:isOpen? ` ${drawerWidth}px`:"50px",
        flexWrap:"wrap"
    }
    }>
      <Box sx={{ display: "flex", alignItems: "center" ,flexWrap:"wrap"}}>
        <Nav>Support</Nav>
        <Nav>privacy</Nav>
        <Nav>Term of Service</Nav>
        <Nav>Contact</Nav>
      </Box>
      <Typo>© {new Date().getFullYear()} - Value</Typo>
    </Box>
  );
}
