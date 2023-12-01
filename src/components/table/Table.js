import React, { useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

//nested data is ok, see accessorKeys in ColumnDef below
const data = [
  {
    name: {
      firstName: 'John',
      lastName: 'Doe',
    },
    address: '261 Erdman Ford',
    city: 'East Daphne',
    state: 'Kentucky',
  },
  {
    name: {
      firstName: 'Jane',
      lastName: 'Doe',
    },
    address: '769 Dominic Grove',
    city: 'Columbus',
    state: 'Ohio',
  },
  {
    name: {
      firstName: 'Joe',
      lastName: 'Doe',
    },
    address: '566 Brakus Inlet',
    city: 'South Linda',
    state: 'West Virginia',
  },
  {
    name: {
      firstName: 'Kevin',
      lastName: 'Vandy',
    },
    address: '722 Emie Stream',
    city: 'Lincoln',
    state: 'Nebraska',
  },
  {
    name: {
      firstName: 'Joshua',
      lastName: 'Rolluffs',
    },
    address: '32188 Larkin Turnpike',
    city: 'Charleston',
    state: 'South Carolina',
  },
];

const Example = () => {
  //should be memoized or stable
  const columns = useMemo(
    () => [
      {
        accessorKey: 'name.firstName', //access nested data with dot notation
        header: 'First Name',
        size: 150,
      },
      {
        accessorKey: 'name.lastName',
        header: 'Last Name',
        size: 150,
      },
      {
        accessorKey: 'address', //normal accessorKey
        header: 'Address',
        size: 200,
      },
      {
        accessorKey: 'city',
        header: 'City',
        size: 150,
      },
      {
        accessorKey: 'state',
        header: 'State',
        size: 150,
      },
    ],
    [],
  );
  const { isOpen, drawerWidth } = useSelector((state) => state.sidebar);

  return <Box sx={{
    marginLeft: "40px",
    marginRight: "10px",
    width: isOpen ? "58%" : "63%",
    '@media (max-width: 1200px)': {
      width: isOpen ? "46.5%" : "58%"
    },
    '@media (max-width: 900px)': {
      padding: "0 30px",
      width: isOpen ? "65%" : "100%"
    },
    '@media (max-width: 600px)': {
      padding: "0 30px",
      marginTop: "320px",
      marginLeft: "05px",
      width: isOpen ? "39%" : "63%"
    }
  }}>
    <MaterialReactTable columns={columns} data={data}
     muiTableHeadCellProps={{
      sx: {
        backgroundColor: (theme) => theme.palette.mode == "dark" && "#1E1E1E",
        color: (theme) => theme.palette.mode == "dark" && "#fff",
      }
    }}
      muiTableBodyCellProps={{
        sx: {
          backgroundColor: (theme) => theme.palette.mode == "dark" && "#1E1E1E",
          color: (theme) => theme.palette.mode == "dark" && "#fff",
        },
      }}
      muiBottomToolbarProps={{
        sx: {
          backgroundColor: (theme) => theme.palette.mode == "dark" && "#1E1E1E",
          
        }
      }}
      muiTopToolbarProps={{
        sx:{
          backgroundColor: (theme) => theme.palette.mode == "dark" && "#1E1E1E", 
        }
      }}
      muiTablePaginationProps={{
        sx:{
          
          color: (theme) => theme.palette.mode == "dark" && "#fff",
        }
      }}
    />;
  </Box>
};

export default Example;
