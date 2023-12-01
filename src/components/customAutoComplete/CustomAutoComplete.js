import React, { useState, useEffect, useRef } from 'react';
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { MaterialReactTable } from 'material-react-table';
import { useMemo } from "react";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { styled, useTheme } from '@mui/material';

const CustomTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    height: '50px'
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderRadius: '5px'
  },
  '& .MuiInputBase-input': {
    fontSize: '20px',
    fontWeight: 'bold',
    color: theme.palette.mode === 'dark' ? 'white' : 'black',
  },
}));

const CustomAutocomplete = ({ data, columns, show, label, onChange , value }) => {
  const theme = useTheme();

  const [rowSelection, setRowSelection] = useState({});
  const [showGrid, setShowGrid] = useState(false);
  const gridRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchArr,setSearchArr] = useState([])
  

  const handleSearchInputChange = (event) => {
    console.log(event)
    let filtered = []
    const query = event;
    if(query === undefined){
      setFilteredData([...data])
    }
    else{

       filtered = data.filter((item) =>
    searchArr.some((prop) =>
      item[prop]?.toLowerCase().includes(query?.toLowerCase())
    )
  );
    }
    // setSearchQuery(query);
    setFilteredData(filtered);
  };

  const handleAutocompleteClick = () => {
    setFilteredData([...data])
    setShowGrid(!showGrid);
    // setSelectedRow("")
  };

  
  useEffect(() => {
    console.log(value);
    for(let i =0 ; i < data.length;i++){
      if(data[i].id === value){
        console.log(data[i][show])
        setSelectedRow(data[i][show])
      }
    }
  }, [value,data]);
  
  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  useEffect(()=>{
  console.log(columns)  
  setSearchArr(columns.map(obj=>obj["accessorKey"]))
  console.log(columns.map(obj=>obj["accessorKey"]))
  },[columns])
  const handleSelectChange = (event) => {
    setSelectedRow(event.target.value);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (gridRef.current && !gridRef.current.contains(event.target)) {
        setShowGrid(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleRowClick = (params) => {
    const newSelection = { [params.row.id]: true };
    setRowSelection(newSelection);
    const selectedData = params.row.original;
    console.log(params.row.original[show])
    setSelectedRow(params.row.original[show]);
    setShowGrid(false)
    if (onChange) {
      onChange(selectedData);
    }   
  };

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 3,
});
  return (
    <div style={{ position: 'relative' }}>
      <Autocomplete
        id="free-solo-demo"
        freeSolo
        disableClearable
        options={[]}
        getOptionLabel={(selectedRow) => `${selectedRow}`}
        onClick={handleAutocompleteClick}
        style={{ width: "100%" }}
        renderInput={(params) => (
          <CustomTextField
            {...params}
            label={label}
            variant="outlined"
            onClick={handleAutocompleteClick}
            sx={{ zIndex: "555656555" }}
            InputProps={{
              ...params.InputProps,
              style: {
                // Set the background color to transparent for the input field
                backgroundColor: 'transparent',
  
              },
            }}
            
            InputLabelProps={{
              style: {
                fontSize: '19px',
                color: theme.palette.mode === 'dark' ? 'white' : 'black',
                backgroundColor: theme.palette.mode !== 'dark' ? 'white' : 'black',
              },
            }}
          />
        )}
        value={selectedRow}
        onChange={(event, newValue) => {
          setSelectedRow(newValue)
          
        }}
        onInputChange={(event, newValue) => {
          console.log(event)
          handleSearchInputChange(event?.target.value);
        }}
      />
      {showGrid && (
        <div

          ref={gridRef}
          style={{
            position: "absolute",
            top: "80%", 
            width: "100%",
            zIndex: 96454534359999,

          }}
        >

          <MaterialReactTable  
            columns={columns}
            data={filteredData}
            enableColumnDragging
            enableColumnOrdering
            muiPaginationProps= {{
              rowsPerPageOptions: [],
            }}
            muiTableHeadCellProps={{


              sx: {
                backgroundColor: (theme) => theme.palette.mode == "dark" && "#141619",
                color: (theme) => theme.palette.mode == "dark" && "#fff",
              }
            }}
            muiTableBodyCellProps={{
              sx: {
                backgroundColor: (theme) => theme.palette.mode == "dark" && "#141619",
                color: (theme) => theme.palette.mode == "dark" && "#fff",
                zIndex:"33333333"
              },
            }}
            muiBottomToolbarProps={{
              sx: {
                backgroundColor: (theme) => theme.palette.mode == "dark" ? "#141619":"white",
    
              }
            }}
            muiTopToolbarProps={{
              sx: {
                display:'none'

              }
            }}
            muiTablePaperProps={{
              elevation: 0,
              sx: {
                borderRadius: '0',
                border: '1px dashed #e0e0e0',
              },
            }}
    
            muiTablePaginationProps={{
              rowsPerPageOptions: [3],
              sx: {
    
                color: (theme) => theme.palette.mode == "dark" && "#fff",
              }
            }}
            muiTableBodyProps={{

              sx: (theme) => ({
                backgroundColor:"white",
                '& tr:hover td': {
                  backgroundColor: (theme) => theme.palette.mode == "dark" && "#4c3838"
                },
                '& tr[data-is-expanded="true"]': {
                 
                  backgroundColor: "yellow",
                },
              })
            }}



            state={{ rowSelection, pagination }}

            initialState={{
              density: 'compact'
            }}
            density="small"
            getRowId={(row) => row.id}
            onPaginationChange={setPagination}
            enableFullScreenToggle={false}
            muiTableBodyRowProps={({ row }) => ({
              onClick: () => handleRowClick({ row }),
              selected: rowSelection[row.id],
              sx: {
                zIndex: 5554656555,

                cursor: 'pointer',
              },
            })}
          />

        </div>
      )}

    </div>
  );
}

export default CustomAutocomplete;
