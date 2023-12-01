import { useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import React, { useCallback, useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,

  Box,
  Grid,
  Typography

} from '@mui/material';
import DropdownButton from '../../../../components/DropdownButton/DropDownButton';

import PathBreadcrumbs from '../../../../components/FormsUI/PathBreadcrumbs';
import { Delete, Edit } from '@mui/icons-material';
import { ExportToCsv } from 'export-to-csv';

import { styled } from '@mui/material/styles';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
// import { ExportToCsv } from 'export-to-csv'; //or use your library of choice here
import { useRef } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ContentCopy } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ExcelExport } from './ExcelExport';
import { useQuery, useMutation } from '@tanstack/react-query';

import { getAll, DeleteGLAccount, Update } from '../../api/GLAccount';
import { convertDataWithSubRows, flattenArrayWithParentId, removeElement,flatenGl } from '../../../../utils/format';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit'; // Import the Edit icon
import { useSelector } from 'react-redux';

import PageTitle from '../../../../components/pageTitle/PageTitle';
import { ToastContainer, toast } from 'react-toastify';
import showToast from '../../../../utils/toastMessage';
import LoadingWrapper from '../../../../components/Loading';
import ErrorWrapper from '../../../../components/Error';
import ValueTree from '../../../../components/ValueTable/ValueTree';


export const List = () => {
  const exportSelectedButtonRef = useRef(null);
  const formRef = useRef();
  const [tableData, setTableData] = useState([]);
  const [dataToexport, setdataToexport] = useState([]);

  const [showForm, setShowForm] = useState(false)
  const [newRowData, setNewRowData] = useState({
    nameAr: '',
    nameEn: ''
  });





  //Fetch Data from BackEnd and change structure

  const { isLoading, error, data: result } = useQuery({
    queryKey: ['GlAccount'],
    queryFn: getAll,
    onSuccess: (result) => {
      console.log(result);
      result = flattenArrayWithParentId(result);

      //console.log(result)
      setTableData(result);
      const modefiedData=convertDataWithSubRows(result)
      setdataToexport(modefiedData);
    }
  });



  const deleteRowQuery = useMutation({
    mutationFn: DeleteGLAccount,
  });
  const EditInRow = (newData, oldData) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log(newData)
        Update({ glAccountId: newData.id, payload: newData }).then(() => {
          getAll().then((res) => {
            setTableData(flattenArrayWithParentId(res))
            showToast(`Edited Successfully`, 2000, 'success');
          })
        })
        resolve();
      }, 0)
    })
  const onRowClick = (e, rowData) => {
    navigate(`/general-ledger/master-files/GL-Account/${rowData.id}`, { state: "view" });
  };
  const editInPage = (e, rowData) => {
    navigate(`/general-ledger/master-files/GL-Account/${rowData.id}`, { state: "edit" });
  };


  const deleteInRow = oldData =>
    new Promise(async (resolve, reject) => {
      setTimeout(() => {
        DeleteGLAccount(oldData.id).then(() => {
          getAll().then((res) => {
            setTableData(flattenArrayWithParentId(res))
            showToast(`Deleted Successfully`, 2000, 'success');
          })
        }).catch((error) => {
          showToast(error.response.data.Message, 2000, "error");
        })
        resolve();
      }, 10)
    })




  const optionss = {
    actions: ['PDF', 'Excel', 'CSV'],
    handler: handleSavee
  };
  const column = [
    { title: 'ID', field: 'accountNo' },

    { title: 'Arabic Name', field: 'nameAr' },
    { title: 'English Name', field: 'nameEn' },
  ]

  const handleAddRow = () => {
    // Generate a unique ID for the new row
    // const newRowId = tableData.length + 1;

    // // Create a new row with default values or prompt the user for input
    // const newRow = {
    //   item: {
    //     nameEn: 'New Name',
    //     nameAr: 'New Name'
    //   }
    //   , subRows: []
    // };

    // // Add the new row to the table data
    // setTableData([...tableData, newRow]);
    setShowForm(true)
    setTimeout(() => {

      formRef.current.scrollIntoView({ behavior: "smooth" });
    }, 200)
  };


  function handleSavee(action) {
    switch (action) {
      case 'PDF':
        handlePdf();
        break;

      case 'Excel':
        handleExportExcel();
        break;

      case 'CSV':
        handleCsv();
        break;

      case 'Selected CSV':
        handleSaveSelectedCsv();
        break;

      default:
        // Handle the case where action is not recognized
        break;
    }
  }

  const columns = useMemo(
    () => [
      {
        enableEditing: false,
        header: 'Actions',
        maxSize: 20,
        accessorKey: 'actions',
        Cell: ({ row }) => (
          <>
            <IconButton onClick={() => deleteCostcenter(row.original.item)} color="error">
              <Delete />
            </IconButton>

            <IconButton
              color="success"
              onClick={() => {
                navigate(row.original.item.id, { state: "view" });
              }}>
              <VisibilityIcon />
            </IconButton>
            <IconButton
              color="#e65100"
              onClick={() => {
                navigate(`/general-ledger/master-files/GL-Account/edit/${row.original.item.id}`, { state: "edit" });
              }}>
              <EditIcon />
            </IconButton>
          </>
        )
      },
      {
        header: 'Name (Arabic)',
        accessorKey: 'item.nameAr',
        enableClickToCopy: true,

        sx: {
          justifyContent: 'flex-start'
        }
      },
      {
        header: 'Name (English)',
        accessorKey: 'item.nameEn',
        enableClickToCopy: true
      }
    ],
    []
  );

  const navigate = useNavigate();



  const ButtonWrapper = styled('div')({
    display: 'flex',
    alignItems: 'center'
  });
  const SpaceBetweenButtons = styled('div')({
    marginRight: '10px'
  });


  
  const flattenedData = flatenGl(dataToexport);

  //---------------------------------------------------------------------------------------------------------------------------------
  //Buttons Functionality
  const handleSave = () => {
    fetchData();

    confirm('Save clicked');
  };
  const handleSaveClose = () => {
    confirm('Save and close clicked');
  };
  const handleSaveNew = () => {
    confirm('save and new clicked');
  };
  //---------------------------------------------------------------------------------------------------------------------------------



  //Handel Export Functionality
  const handleExportExcel = () => {
  
    ExcelExport({ data: flattenedData });
  };
  const handleCsv = () => {
    handleExportData();
  };
  const handleSaveSelectedCsv = () => {
    confirm('Exported Selected As CSV Done');
    if (exportSelectedButtonRef.current) {
      exportSelectedButtonRef.current.click();
    }
  };

  //---------------------------------------------------------------------------------------------------------------------------------
  //Handel Adding Functionality
  const handelInPage = () => {
    setCreateModalOpen(true);
  };
  const HandelNewPage = () => {
    navigate('/general-ledger/master-files/GL-Account/add', { state: "add" });
  };

  //---------------------------------------------------------------------------------------------------------------------------------

  //Save Options
  const options = [
    {
      name: 'Save',
      handler: handleSave
    },
    {
      name: 'Save and close',
      handler: handleSaveClose
    },
    {
      name: 'Save and new',
      handler: handleSaveNew
    }
  ];

  //---------------------------------------------------------------------------------------------------------------------------------
  // PDF Functionality
  const handlePdf = () => {
    const doc = new jsPDF();
    doc.addFont('amiriri-regular.ttf', 'amiriri', 'normal');
    doc.setFont('amiriri');
    doc.setFontSize(14);
  
    // Add your title or any other content here
    doc.text('General Ledger Chart', 10, 20);
  
    const columnsForPdf = column.map((col) => col.title);
  
    const dataForPdf = tableData.map((row) =>
      column.map((col) => {
        const accessorKeys = col.field.split('.');
        let value = row;
        for (const key of accessorKeys) {
          value = value[key];
        }
        return value;
      })
    );
  
    doc.autoTable({
      head: [columnsForPdf],
      body: dataForPdf,
      startY: 30, // Set the starting Y position for the table
    });
  
    doc.save('general_ledger_chart.pdf');
  };
  
  //---------------------------------------------------------------------------------------------------------------------------------
  //Cost Center Crud

  const deleteCostcenter = useCallback(
    async (itemId) => {
      if (
        !window.confirm(
          `Are you sure you want to delete item with Name: ${itemId.nameEn}`
        )
      ) {
        return;
      }

      try {
        const response = await deleteRowQuery.mutateAsync(itemId.id);
        if (response.status == 200) {
          // const dataR = removeElement(tableData, itemId.id);
          // setTableData(dataR);
          getAll().then((res) => {
            console.log(convertDataWithSubRows(res))
            setTableData(convertDataWithSubRows(res))
          })
          showToast("The item has been deletes")
        }
      } catch (error) {
        console.error('Error deleting cost center:', error);
        showToast(error.response.data.Message, 2000, "error");

      }
    },
    [deleteRowQuery]
  );

  //Edite in Place
  const editeCostcenter = async ({ exitEditingMode, row, values }) => {
    const { actions, 'item.nameAr': nameAr, 'item.nameEn': nameEn, ...dataToSend } = values;

    const newData = {
      nameAr,
      nameEn
    };


    exitEditingMode();
  };

  //---------------------------------------------------------------------------------------------------------------------------------

  //CSV Exports Functionality
  const staticHeaders = ['ID', 'Arbic Name', 'English Name'];

  const csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: staticHeaders,
    filename: 'GL Accounts', 
  };
  const csvExporter = new ExportToCsv(csvOptions);

  //Selected Row Export CSV
  const handleExportRows = (rows) => {
    const flattenedData = [];
    for (const row of rows) {
      if (typeof row.original === 'object') {
        const mappedData = {
          // id: row.original.item.id,
          nameAr: row.original.item.nameAr,
          nameEn: row.original.item.nameEn
          // parent: '',
        };
        flattenedData.push(mappedData);
        if (row.original.subRows && row.original.subRows.length > 0) {
          for (const subRow of row.original.subRows) {
            const subMappedData = {
              id: subRow.item.id,
              nameAr: subRow.item.nameAr,
              nameEn: subRow.item.nameEn,
              parent: row.original.item.id
            };
            flattenedData.push(subMappedData);
          }
        }
      }
    }
    csvExporter.generateCsv(flattenedData);
  };

  //Export All Data  CSV
  const handleExportData = () => {
    const flattenedData = [];
    const flattenObject = (item, depth = 0, parentIndex = 0) => {
      if (typeof item === 'object') {
        const newItem = {
          // depth: depth,
          ID: item.accountNo,
          nameAr: item.nameAr,
          nameEn: item.nameEn
        };
        flattenedData.push(newItem);
        const currentItemIndex = flattenedData.length - 1; 
        if (item.subRows && item.subRows.length > 0) {
          for (const subItem of item.subRows) {
            flattenObject(subItem, depth + 1, currentItemIndex); 
          }
        }
      }
    };
    for (const item of dataToexport) {
      flattenObject(item);
    }
    csvExporter.generateCsv(flattenedData);
  };

  //---------------------------------------------------------------------------------------------------------------------------------

  //Export Options
  const exportType = [
    {
      name: 'PDF',
      handler: handlePdf
    },
    {
      name: 'Excel',
      handler: handleExportExcel
    },
    {
      name: 'CSV',
      handler: handleCsv
    },
    {
      name: 'Seleted As CSV',
      handler: handleSaveSelectedCsv
    }
  ];
  const { isOpen, drawerWidth } = useSelector((state) => state.sidebar);

  return (


    <Box>
      {isLoading ? (
        <LoadingWrapper />
      ) : error ? (
        <ErrorWrapper />
      ) : (
        result && (
          <Box sx={{ flexDirection: 'column', backgroundColor: (theme) => theme.palette.mode == "dark" ? "#000" : "#153d77" }}>
            <ToastContainer />
            <Box sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginLeft: '20px',
              alignItems: "center",
              mb: "15px",
              '@media (max-width: 600px)': {
                flexDirection: isOpen ? 'column' : 'row'
              },
            }}>





              <PageTitle text="General Ledger Chart" />




              <Box sx={{ display: "flex", marginRight: "20px" }}>

                <Grid alignItems="center" justifyContent="space-between" >



                  <Grid item>
                    <Box sx={{ display: "flex" }}>

                      <DropdownButton
                        disabled={false}
                        options={{
                          actions: ['New'],
                          handler: function () {
                            navigate('/general-ledger/master-files/GL-Account/add', { state: "add" });

                          }
                        }}
                        iconName="addCircle"
                        buttonColor={''}
                        hoverText={'Add New GL Account'}

                      />
                    </Box>

                  </Grid>
                </Grid>

                <DropdownButton buttonName="Export" options={optionss} icon="save" iconName="export" 
                                  hoverText={'Export all GL Accounts'}

                />


              </Box>

            </Box>
            <Box sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: "center",
              '@media (max-width: 600px)': {
                flexDirection: isOpen ? 'column' : 'row'
              },
            }}>
              <PathBreadcrumbs crumbs={location.pathname.substring(1).split('/').map((string) => string.replace(/-/g, ' '))} />

            </Box>
            {/* <MaterialReactTable

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
                },
              }}
              muiBottomToolbarProps={{
                sx: {
                  backgroundColor: (theme) => theme.palette.mode == "dark" && "#141619",

                }
              }}
              muiTopToolbarProps={{
                sx: {
                  backgroundColor: (theme) => theme.palette.mode == "dark" && "#141619",
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
                sx: {
                  paging: true,
                  pageSize: 50,       // Make initial page size 50
                  emptyRowsWhenPaging: false,   // To avoid having empty rows
                  pageSizeOptions: [6, 12, 20, 50],    // Rows selection options
                  color: (theme) => theme.palette.mode == "dark" && "#fff",
                }
              }}


              muiTableBodyProps={{
                sx: (theme) => ({
                  '& tr:hover td': {
                    backgroundColor: (theme) => theme.palette.mode == "dark" && "#4c3838"
                  },
                  '& tr[data-is-expanded="true"]': {

                    backgroundColor: "yellow",
                  },
                })
              }}
              columns={columns}
              data={tableData}
              enableExpandAll={false}
              enableExpanding
              filterFromLeafRows
              initialState={{
                expanded: false,
                density: 'compact'
              }}
              paginateExpandedRows={false}
              enableRowSelection
              positionToolbarAlertBanner="bottom"
              //Edite
              editingMode="row"
              enableEditing
              onEditingRowSave={editeCostcenter}
              enableColumnOrdering
              // editable={{
              //   onRowAdd: (newData) =>
              //     new Promise((resolve, reject) => {
              //       // Add the new row to the data array
              //       setData([...data, newData]);
              //       resolve();
              //     }),
              // }}


              state={{
                isLoading: isLoading
              }}

              muiTableBodyRowProps={({ row }) => ({
                sx: {
                  backgroundColor: row.depth > 0 ? '#F7E7E7' : 'inherit',
                },
              })}



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
            /> */}
            <ValueTree data={tableData} col={column} handleEdit={EditInRow} handleRowClick={onRowClick} handleDelete={deleteInRow} editInPage={editInPage} pageSize={20} />
          </Box>
        )
      )}

    </Box>
  );
};
