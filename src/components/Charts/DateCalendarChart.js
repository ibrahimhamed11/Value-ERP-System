import { useState } from 'react';
import dayjs from 'dayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
const DataCalenderChart = () => {
  const [value, setValue] = useState(dayjs('2022-04-17'));
  return <DateCalendar value={value} onChange={(newValue) => setValue(newValue)} />;
};
export default DataCalenderChart;
