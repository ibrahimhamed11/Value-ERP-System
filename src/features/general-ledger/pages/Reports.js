import { useLocation } from 'react-router-dom';
export const Reports = () => {
  let location = useLocation();
  return (
    <h2>
      `Reports pathName : {location.pathname} {JSON.stringify(location)}`
    </h2>
  );
};
