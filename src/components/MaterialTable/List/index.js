import React from 'react';
import { MaterialReactTable } from 'material-react-table';
import { darken, Box, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const MaterialTableList = ({
  cols,
  tableData,
  tableInstanceRef,
  handleSaveRow,
  setRowSelection,
  rowSelection,
  loading,
  setTableData,
  handleActionsRow,
  actions,
  ...otherProps
}) => {
  const getColumns = (cols) => {
    return [
      {
        id: 'editRow',
        header: 'Edit Row',
        columnDefType: 'display',
        size: 100,
        enableColumnOrdering: false,
        Cell: ({ row }) => (
          <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
            <IconButton color="secondary" onClick={() => handleActionsRow(actions.edit, row)}>
              <EditIcon />
            </IconButton>{' '}
            <IconButton color="error" onClick={() => handleActionsRow(actions.del, row)}>
              <DeleteIcon />
            </IconButton>
            <IconButton color="success" onClick={() => handleActionsRow(actions.view, row)}>
              <VisibilityIcon />
            </IconButton>
          </Box>
        )
      },
      ...cols
    ];
  };

  const configMaterialTree = {
    ...otherProps
  };

  return (
    <MaterialReactTable
      {...configMaterialTree}
      columns={getColumns(cols)}
      data={tableData}
      enableColumnActions
      tableInstanceRef={tableInstanceRef}
      enableColumnDragging
      enableColumnOrdering
      enableColumnResizing
      editingMode="row"
      enableEditing
      onEditingRowSave={handleSaveRow}
      enableRowActions
      displayColumnDefOptions={{
        'mrt-row-actions': {
          header: 'Edit in Grid'
        }
      }}
      enableRowSelection
      onRowSelectionChange={setRowSelection}
      getRowId={(row) => row.id}
      state={{
        rowSelection,
        isLoading: loading
      }}
      muiTableBodyProps={{
        sx: (theme) => ({
          '& tr:nth-of-type(even)': {
            backgroundColor:'white'
          }
        })
      }}
    />
  );
};

export default MaterialTableList;
