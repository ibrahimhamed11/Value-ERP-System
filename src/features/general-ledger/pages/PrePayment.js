import { useLocation } from 'react-router-dom';
export const PrePayment = () => {
  let location = useLocation();
  return (
    <h1>
      `Pre Payment and Accrual Entry pathName : {location.pathname} {JSON.stringify(location)}`
    </h1>
  );
};
