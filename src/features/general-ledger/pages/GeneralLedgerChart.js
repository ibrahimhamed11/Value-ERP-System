import { useLocation } from 'react-router-dom';
export const GeneralLedgerChart = () => {
  let location = useLocation();
  return (
    <h1>
      `general ledger aaaaa chart pathName : {location.pathname} {JSON.stringify(location)}`
    </h1>
  );
};
