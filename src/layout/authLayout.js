import PropTypes from 'prop-types';
import { Box, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import logo from '../components/Logo/Value.png';






// TODO: Change subtitle text

export const Layout = (props) => {
  const { children } = props;

  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        flex: '1 1 auto',
        height: '100vh', // Add this line
      }}
    >
      <Grid
        container
        sx={{ flex: '1 1 auto' }}
      >
        <Grid
          xs={12}
          lg={6}
          sx={{
            backgroundColor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            height: '100%', // Add this line
          }}
        >
          <Box
            component="header"
            sx={{
              left: 0,
              p: 3,
              position: 'fixed',
              top: 0,
              width: '100%',
            }}
          >
            <Box
              href="/"
              sx={{
                display: 'inline-flex',
                height: 32,
                width: 32,
              }}
            >

            </Box>
          </Box>
          {children}
        </Grid>
        <Grid
          xs={12}
          lg={6}
          sx={{
            alignItems: 'center',
            background: 'radial-gradient(50% 50% at 50% 50%, #E0E0E0 0%, #C5C4C4 100%)',
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            '& img': {
              maxWidth: '100%',
            },
            height: '100vh', // Set the height to 100vh
          }}
        >
          <Box sx={{ p: 3 }}>
           
            <Typography
              align="center"
              sx={{ mb: 1,color: '#0ea7e8',  fontSize: '24px',
              lineHeight: '32px',     fontWeight: 'bold', }}
              
              variant="subtitle1"
            >
With Value Plus, your work is always safe
            </Typography>
          
            <img src={logo} alt="Logo" />


          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};
