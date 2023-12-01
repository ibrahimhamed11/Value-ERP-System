import { useLocation } from 'react-router-dom';
export const Project = () => {
  let location = useLocation();
  return (
    <h1>
      `projects pathName : {location.pathname} {JSON.stringify(location)}`
    </h1>
  );
};
