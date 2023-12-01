import { useState } from 'react';
import { Box, Typography, Button, Collapse, Card, CardContent, Grid } from '@mui/material';

import { ExpandLess } from '@mui/icons-material';
export const Section = ({ name, children }) => {
  const [companyexpanded, setCompanyExpanded] = useState(true);
  const ExpandClick = () => {
    setCompanyExpanded(!companyexpanded);
  };
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        margin: '0 auto',
        padding: 5,
        boxShadow: `0px 3px 6px rgba(0, 0, 0, 0.16)`,
        backgroundColor: (theme) =>theme.palette.mode == "light"? theme.palette.primary.light : "#1E1E1E",
        borderRadius: (theme) => theme.spacing(1),
        width: "100%"

      }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          borderRadius: (theme) => theme.spacing(1, 1, 0, 0),
          paddingX: 3,
          paddingY: "6px",
          alignContent: 'center',
          marginBottom: "15px",
          alignItems: "center",
          height: "fit-content",
          backgroundColor: (theme) =>
          theme.palette.mode ==="light"?
            theme.palette.primary.main:"#000"
        }}>
        <Typography variant="h3" sx={{ ml: 5, marginTop: "0", marginBottom: "0", fontFamily: 'Roboto, sans-serif' }}>
          {name}
        </Typography>

        <Button
          onClick={ExpandClick}
          sx={{
            backgroundColor: (theme) =>
            theme.palette.mode ==="light"?
            theme.palette.primary.main:"#1e1e1e"
          }}>
          <ExpandLess
            sx={[
              {
                color: (theme) =>
                  theme.palette.mode === 'light'
                    ? theme.palette.secondary.main
                    : theme.palette.secondary.light,
                transform: 'rotate(180deg)',
                transition: 'transform .4s ease-in-out'
              },
              companyexpanded && { transform: 'rotate(0deg)' }
            ]}
          />
        </Button>
      </Box>
      <Collapse in={companyexpanded} timeout="auto" unmountOnExit>
        <Card
          sx={{
            borderRadius: (theme) => theme.spacing(0, 0, 1, 1),
            backgroundColor:(theme)=>theme.palette.mode == "dark" && "#1E1E1E",
            overflow:"visible"
          }}>
          <CardContent>
            <Grid container spacing={2}>
              {children}
            </Grid>
          </CardContent>
        </Card>
      </Collapse>
    </Box>
  );
};
