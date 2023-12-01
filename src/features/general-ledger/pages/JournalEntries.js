import { useLocation } from 'react-router-dom';
export const JournalEntries = () => {
  let location = useLocation();
  return (
    <h1>
      `Journal Entries pathName : {location.pathname} {JSON.stringify(location)}`
    </h1>
  );
};
