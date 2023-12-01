import Box from '@mui/material/Box';
import { MaterialReactTable } from 'material-react-table';
import { useMemo } from 'react';

const DataGridChart = () => {
  const columns = useMemo(
    () => [
      {
        header: 'ID',
        accessorKey: 'id'
      },
      {
        header: 'First Name',
        accessorKey: 'firstName'
      },
      {
        header: 'Last Name',
        accessorKey: 'lastName'
      },
      {
        header: 'AGE',
        accessorKey: 'age'
      }
    ],
    []
  );
  const data = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 }
  ];

  return <MaterialReactTable columns={columns} data={data} />;
};
export default DataGridChart;

/*    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5
            }
          }
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
      />
    </Box> */
