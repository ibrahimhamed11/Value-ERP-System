// material-ui
import { useTheme, styled } from '@mui/material/styles';
import {
  Avatar,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography
} from '@mui/material';
import { Storefront, Email } from '@mui/icons-material'; // Import Mui icons
import { Item } from 'semantic-ui-react';
import { notifyManager } from 'react-query';

// styles
const ListItemWrapper = styled('div')(({ theme }) => ({
  cursor: 'pointer',

  padding: 16,
  '&:hover': {
    background: theme.palette.primary.light
  },
  '& .MuiListItem-root': {
    padding: 0
  }
}));

// ==============================|| NOTIFICATION LIST ITEM ||============================== //

const NotificationList = () => {
  const theme = useTheme();

  const chipSX = {
    height: 10,
    padding: '0 6px'
  };
  const chipErrorSX = {
    ...chipSX,
    color: theme.palette.orange.dark,
    backgroundColor: theme.palette.orange.light,
    marginRight: '5px'
  };

  let notfication = [{
    title: "Update completed",
    content: "lorem lorem lorm lorem lorem lorem lorm lorem lorem lorem lorm lorem",
    time: "22:36PM"
  },
  {
    title: "Update completed",
    content: "lorem lorem lorm lorem lorem lorem lorm lorem lorem lorem lorm lorem lorem",
    time: "18:21PM"
  }
  ]
  return (
    <List
      sx={{
        width: '100%',
        maxWidth: 300,
        py: 0,
        zIndex: 10000,
        borderRadius: '10px',
        [theme.breakpoints.down('md')]: {
          maxWidth: 300
        },
        '& .MuiListItemSecondaryAction-root': {
          top: 22
        },
        '& .MuiDivider-root': {
          my: 0,
        },
        '& .list-container': {
          pl: 7
        }
      }}
    >
      {
        notfication.map((notify, index) => (
          <>
          <Divider key={index} />
          <Grid  key={index} sx={{
            display: "flex",
            paddingLeft: "30px",
            paddingY: "10px",
            alignItems: "center"
          }}>
            <Avatar
              sx={{
                color: theme.palette.success.dark,
                backgroundColor: theme.palette.success.light,
                border: 'none',
                borderColor: theme.palette.success.main,
                marginRight: "30px"
              }}
            >
              <Storefront stroke={1.5} size="1.3rem" />
            </Avatar>
            <Grid>
              <Typography variant='h2' sx={{ color: "black", fontSize: "0.9375rem" }}>{notify.title}</Typography>
              <Typography variant='h4' sx={{
                color: "black",
                fontSize: "0.7375rem",
                lineHeight: "18px",
                marginBottom: "15px"
              }}>{notify.content}</Typography>
              <Typography variant='h4' sx={{
                color: "black",
                fontSize: "0.7375rem"
              }}>{notify.time}</Typography>
            </Grid>
          </Grid>
          </>
        ))
      }
     
      {/* <ListItemWrapper>
        <ListItem alignItems="center">
          <ListItemAvatar>
            <Avatar
              sx={{
                color: theme.palette.success.dark,
                backgroundColor: theme.palette.success.light,
                border: 'none',
                borderColor: theme.palette.success.main
              }}
            >
              <Storefront stroke={1.5} size="1.3rem" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={<Typography variant="subtitle1">Store Verification Done</Typography>}
          />
          <ListItemSecondaryAction>
            <Grid container justifyContent="flex-end">
              <Grid item xs={12}>
                <Grid container direction="column" className="list-container">
                  <Grid item xs={12} sx={{ pb: 2 }}>
                    <Typography variant="subtitle2">We have successfully received your request.</Typography>
                  </Grid>
                  
                </Grid>

              </Grid>
            </Grid>
          </ListItemSecondaryAction>
        </ListItem>
        <Typography variant="caption" display="block" gutterBottom>
          2 min ago
        </Typography>
      </ListItemWrapper>
      <Divider />

      <ListItemWrapper>
        <ListItem alignItems="center">
          <ListItemAvatar>
            <Avatar
              sx={{
                color: theme.palette.primary.dark,
                backgroundColor: theme.palette.primary.light,
                border: 'none',
                borderColor: theme.palette.primary.main
              }}
            >
              <Email stroke={1.5} size="1.3rem" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={<Typography variant="subtitle1">Check Your Mail.</Typography>} />
          <ListItemSecondaryAction>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Typography variant="caption" display="block" gutterBottom>
                  2 min ago
                </Typography>
              </Grid>
            </Grid>
          </ListItemSecondaryAction>
        </ListItem>
      </ListItemWrapper> */}

      {/* <Divider />

      <Divider /> */}
    </List>
  );
};

export default NotificationList;
