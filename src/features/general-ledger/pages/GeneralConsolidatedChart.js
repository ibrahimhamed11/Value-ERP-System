import { useLocation } from 'react-router-dom';
export const GeneralConsolidatedChart = () => {
  let location = useLocation();
  return (
    <h1>
      `General Consolidated Chart pathName : {location.pathname} {JSON.stringify(location)}`
    </h1>
  );
};
