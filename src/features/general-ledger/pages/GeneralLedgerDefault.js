import { useLocation } from 'react-router-dom';
export const Default = () => {
  let location = useLocation();
  return (
    <h1>
      ` Default pathName : {location.pathname} {JSON.stringify(location)}`
    </h1>
  );
};
