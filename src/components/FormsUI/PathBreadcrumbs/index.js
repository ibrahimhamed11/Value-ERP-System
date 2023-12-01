import { Typography,  Breadcrumbs } from '@mui/material';
import { Link , NavLink} from 'react-router-dom';
export default function PathBreadcrumbs({ crumbs }) {
  function handleClick(event) {
    console.info('You clicked a breadcrumb.');
  }
  return (
    <div role="presentation" onClick={handleClick} style={{marginLeft:"20px",marginTop:"0"}}>
      <Breadcrumbs aria-label="breadcrumb" sx={{marginBottom:"20px" }}>
        {Array.isArray(crumbs) &&
          crumbs.map((crumb, index) => {
            if (['company', 'branch'].includes(crumb)) {
              return (
                <Link key={index} style={{textDecoration:"none"}} color="inherit" to={`/organization/${crumb}`}>
                  <Typography variant="h3" sx={{ margin:"0",color: (theme) => theme.palette.secondary.main ,fontFamily: 'Roboto, sans-serif'}}>
                    {crumb.charAt(0).toUpperCase() + crumb.slice(1)}
                  </Typography>
                </Link>
              );
            } 
            else if(['costcenter','GL Account','CostCenterCategory'].includes(crumb)){
              return (
                <NavLink style={{textDecoration:"none"}} key={index} color="inherit" to={`/general-ledger/master-files/${crumb.replace(/ /g, '-')}`}>
                  <Typography variant="h3" sx={{ margin:"0",color: (theme) => theme.palette.secondary.main ,fontFamily: 'Roboto, sans-serif'}}>
                    {crumb.charAt(0).toUpperCase() + crumb.slice(1)}
                  </Typography>
                </NavLink>
              );
            }
            else if(['journal'].includes(crumb)){
              return (
                <NavLink key={index} style={{textDecoration:"none"}} color="inherit" to={`/general-ledger/transactions/${crumb}`}>
                  <Typography variant="h3" sx={{ margin:"0",color: (theme) => theme.palette.secondary.main ,fontFamily: 'Roboto, sans-serif'}}>
                    {crumb.charAt(0).toUpperCase() + crumb.slice(1)}
                  </Typography>
                </NavLink>
              );
            }
            else if(['role','user'].includes(crumb)){
              return (
                <NavLink key={index} style={{textDecoration:"none"}} color="inherit" to={`/administration/${crumb}`}>
                  <Typography variant="h3" sx={{ margin:"0",color: (theme) => theme.palette.secondary.main ,fontFamily: 'Roboto, sans-serif'}}>
                    {crumb.charAt(0).toUpperCase() + crumb.slice(1)}
                  </Typography>
                </NavLink>
              );
            }

            else {
              return (
                <Typography key={index} variant="h3" sx={{fontFamily: 'Roboto, sans-serif',margin:"0"}}>
                  {crumb.charAt(0).toUpperCase() + crumb.slice(1)}
                </Typography>
              );
            }
          })}
      </Breadcrumbs>
    </div>
  );
}
