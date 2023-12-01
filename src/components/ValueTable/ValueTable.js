import { Box } from '@mui/material';
import MaterialTable from 'material-table';
import React, { useState } from 'react';

function ValueTable({ data, handleAdd, handleEdit, handleDelete, col, handleRowClick, editInPage, pageSize, multiSelect = false, onSelectedRowsChange }) {
    const [filter_list, setFilter] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);

    return (
        <Box className="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation2 css-1blq7ol-MuiPaper-root" sx={{ '& .MuiPaper-root': { borderRadius: 0 }, width: "100%", overflow: "hidden" }}>
            <MaterialTable
                options={{
                    addRowPosition: 'first',
                    filtering: filter_list === false ? false : true,
                    columnResizable: true,
                    columnsButton: true,
                    pageSize: pageSize ? pageSize : 5,
                    selection: multiSelect,
                    showSelectAllCheckbox: false,
                    selectionProps: rowData => ({
                        color: 'primary',
                    }),
                }}
                title={''}
                editable={{
                    onRowAdd: handleAdd,
                    onRowUpdate: handleEdit,
                    onRowDelete: handleDelete,
                }}
                onRowClick={handleRowClick}
                columns={col}
                data={data}
                actions={[
                    {
                        icon: 'filter_list',
                        tooltip: 'Enable filter',
                        isFreeAction: true,
                        onClick: () => setFilter(!filter_list),
                    },
                    {
                        icon: 'draw',
                        tooltip: 'Edit in page',
                        onClick: editInPage,
                    }
                ]}
                onSelectionChange={rows => {
                    setSelectedRows(rows);
                    onSelectedRowsChange(rows);
                }}
            />
        </Box>
    );
}

export default ValueTable;
