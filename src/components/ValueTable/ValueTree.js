import { Box } from '@mui/material';
import MaterialTable from 'material-table';
import React, { useState } from 'react'

function ValueTree({ data, handleAdd, handleEdit, handleDelete, col, handleRowClick, editInPage,pageSize, multiSelect = false ,onSelectedRowsChange }) {
    const [filter_list, setFilter] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);

    const getRowStyle = (rowData) => ({
        backgroundColor: rowData.parentId === null ? '#FFFFFF' : '#EFEFEF',
        '&:hover': {
            backgroundColor: rowData.parentId === null ? '#FFFFE0' : '#E0E0E0',
        },
    });

    
    return (
<Box className="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation2 css-1blq7ol-MuiPaper-root MuiBox-root css-1akc39b" sx={{ borderRadius: 0 }}>
            <MaterialTable
                options={{

                    addRowPosition: "first",
                    filtering: filter_list == false ? false : true,
                    columnResizable: true,
                    columnsButton: true,
                    pageSize: pageSize ? pageSize : 5,
                    selection: multiSelect, 

                    rowStyle: rowData => ({

                        backgroundColor: rowData.parentId === undefined ? '#FFFFFF' : '#abe0f7'
                    })
                }}
                title={""}
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
                        icon: 'save',
                        tooltip: 'Edit in page',
                        onClick: editInPage
                    },
                    {
                        icon: 'filter_list',
                        tooltip: 'enable filter',
                        isFreeAction: true,
                        onClick: () => setFilter(!filter_list)
                    }
                ]}

                parentChildData={(row, rows) => {
                    return rows.find(a => a.id === row.parentId)
                }}


                onSelectionChange={rows => {
                    setSelectedRows(rows);
                    onSelectedRowsChange(rows);
                }}
            />

        </Box>
    )
}

export default ValueTree