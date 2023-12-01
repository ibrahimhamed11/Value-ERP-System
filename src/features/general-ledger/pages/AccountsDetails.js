import { useLocation } from 'react-router-dom';
export const AccountsDetails = () => {
  let location = useLocation();
  return (
    <h1>
      `CAccounts Details Queries pathName : {location.pathname} {JSON.stringify(location)}`
    </h1>
  );
};
