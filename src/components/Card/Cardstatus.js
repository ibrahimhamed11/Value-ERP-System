import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const StyledCard = styled(CardContent)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light' ? "#fff" : "#1E1E1E",
  padding: theme.spacing(3),
  boxShadow: `${theme.spacing(0, 1, 2)} ${theme.palette.boxShadow.dark}`,
  transition: 'box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: `${theme.spacing(0, 1, 2)} ${theme.palette.boxShadow.dark}`
  },
  '&::before': {}
}));

const StyledAvatar = styled('div')(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main,
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'transform 0.8s ease',
  // '&:hover': {
  //   transform: 'rotate(360deg)'
  // },
  zIndex: 1
}));

const StyledPriceContainer = styled('span')(({ theme }) => ({
  // display: 'flex',
  // alignItems: 'center',
  fontSize: '2rem',
  fontWeight: '300',
  marginTop: '-10%',
  marginBottom: '10%',
  color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
  zIndex: 1
}));
const StyledDollarIcon = styled('span')(({ theme }) => ({
  marginRight: theme.spacing(1)
}));

const SalesTodayTypography = styled(Typography)(({ theme }) => ({
  fontSize: '0.9375rem',
  fontWeight: "500",
  marginBottom: '0.75rem',
  // marginTop: '15px',
  color: theme.palette.mode === 'light' ? theme.palette.primary.dark : theme.palette.primary.light
}));

const BigCardContainer = styled('div')({
  width: '100%',
  display: 'flex',
  // justifyContent: 'center',
  alignItems: 'center',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)'
  }
});
// const Icon = styled(LocalShippingIcon)(({ theme }) => ({
//   fontSize: 60,
//   color:
//     theme.palette.mode === "dark"
//       ? theme.palette.primary.dark
//       : theme.palette.primary.light,
// }));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontSize: '15px',
  color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark
}));

const PercentageText = styled(Typography)({
  color: 'red',
  fontSize: '15px'
});

const CardStatus = ({ headTitle, price, type, percentageText }) => {
  const theme = useTheme();
  const getIcon = (type) => {
    switch (type) {
      case 'dolar':
        return <LocalShippingIcon />;
      default:
        return (
          <LocalShippingIcon
            sx={{
              width: theme.spacing(5),
              height: theme.spacing(5),
              fontSize: theme.spacing(3),
              color: theme.palette.primary.light
            }}
          />
        );
    }
  };
  return (
    <Card sx={{
      borderRadius: '3px',
      width: "49.5%",
      backgroundColor: "white",
      marginBottom: "9px",
      '@media (max-width: 600px)': {
        width: "95%"
      }
    }}>
      <StyledCard>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <SalesTodayTypography>{headTitle}</SalesTodayTypography>
          </Box>
          <Box>
            <StyledAvatar
              sx={{
                backgroundColor: '#2469ce'
              }}
            >
              {getIcon(type)}
            </StyledAvatar>
          </Box>
        </Box>
        <BigCardContainer>
          <Typography variant="h1" sx={{ mt: 1, mb: 3,fontFamily: 'Roboto, sans-serif' }}>
            <StyledPriceContainer>
              <StyledDollarIcon></StyledDollarIcon>
              {price}
            </StyledPriceContainer>
          </Typography>
        </BigCardContainer>
        <Box display="flex" alignItems="center" justifyContent="flex-start" mt={1}>
          <PercentageText>{percentageText}</PercentageText>
          <Box ml={1}>
            <StyledTypography variant="body1" sx={{fontFamily: 'Roboto, sans-serif'}}>Less sales than usual</StyledTypography>
          </Box>
        </Box>
      </StyledCard>
    </Card>
  );
};

export default CardStatus;
