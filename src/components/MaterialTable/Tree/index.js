import React from 'react';
import { MaterialReactTable } from 'material-react-table';
import { darken, Box, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const MaterialTableTree = ({
  cols,
  tableData,
  tableInstanceRef,
  handleSaveRow,
  setRowSelection,
  rowSelection,
  ...otherProps
}) => {
  const configMaterialTree = {
    ...otherProps
  };

  return (
    <>
      <MaterialReactTable
        {...configMaterialTree}
        columns={cols}
        data={tableData ?? []}
        enableExpandAll={false}
        enableExpanding
        filterFromLeafRows
        initialState={{
          expanded: true
        }}
        paginateExpandedRows={false}
        enableRowSelection
        positionToolbarAlertBanner="bottom"
        getRowId={(row) => {
          try {
            return row.id;
          } catch (error) {}
        }}
        //Edite
        editingMode="row"
        enableEditing
        onEditingRowSave={handleSaveRow}
        enableColumnOrdering
        renderTopToolbarCustomActions={({ table }) => (
          <Button
            ref={exportSelectedButtonRef}
            disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
            onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
            startIcon={<FileDownloadIcon />}
            variant="contained"
            style={{
              display: 'none'
            }}>
            Export Selected Rows{' '}
          </Button>
        )}
      />
      <CreateNewAccountModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />
    </>
  );
};

export default MaterialTableTree;

// <MaterialReactTable
//   {...configMaterialTree}
//   columns={getColumns(cols)}
//   data={tableData}
//   enableColumnActions
//   tableInstanceRef={tableInstanceRef}
//   enableColumnDragging
//   enableColumnOrdering
//   enableColumnResizing
//   editingMode="row"
//   enableEditing
//   onEditingRowSave={handleSaveRow}
//   enableRowActions
//   displayColumnDefOptions={{
//     'mrt-row-actions': {
//       header: 'Edit in Grid'
//     }
//   }}
//   enableRowSelection
//   onRowSelectionChange={setRowSelection}
//   getRowId={(row) => row.id}
//   state={{
//     rowSelection,
//     isLoading: loading
//   }}
//   muiTableBodyProps={{
//     sx: (theme) => ({
//       '& tr:nth-of-type(even)': {
//         backgroundColor: darken(theme.palette.background.default, 0.1)
//       }
//     })
//   }}
// />
