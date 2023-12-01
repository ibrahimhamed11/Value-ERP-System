import { useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import React, { useCallback, useState, useEffect } from 'react';
import {
  Button,
  IconButton,
  Box,
  Grid,
  Typography
} from '@mui/material';
import DropdownButton from '../../../../components/DropdownButton/DropDownButton'; // Adjust the path based on your project structure
import { styled } from '@mui/material/styles';
import { ExportToCsv } from 'export-to-csv';
import { useRef } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ExcelExport } from './ExcelExport';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getAll, DeleteCostCenter, Update, GetById } from '../../api/costCenter';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete,
  Edit,
  FileDownload as FileDownloadIcon
} from '@mui/icons-material';
import PathBreadcrumbs from '../../../../components/FormsUI/PathBreadcrumbs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import showToast from '../../../../utils/toastMessage';
import { useSelector } from 'react-redux';
import PageTitle from '../../../../components/pageTitle/PageTitle';
import LoadingWrapper from '../../../../components/Loading';
import ErrorWrapper from '../../../../components/Error';
import ValueTree from '../../../../components/ValueTable/ValueTree';
import { convertDataWithSubRows, flattenArrayWithParentId, removeElement,flattenData } from '../../../../utils/format';


export const List = () => {
  const navigate = useNavigate();
  const exportSelectedButtonRef = useRef(null);
  const [tableData, setTableData] = useState([]);
  const [dataToexport, setdataToexport] = useState([]);

  const [rowSelection, setRowSelection] = useState([]);


  const handleSelectedRows = (rows) => {
    setRowSelection(rows);
    console.log('row selection:', rows);
};

  
  //Fetch Data from BackEnd and change structure
  const { isLoading, error, data: result } = useQuery({
    queryKey: ['CostCenter'],
    queryFn: getAll,
    onSuccess: (result) => {
      const resultt = flattenArrayWithParentId(result);
      setTableData(resultt);
      const modefiedData=convertDataWithSubRows(result)
      setdataToexport(modefiedData);
    }
  });

  //Delete Api
  const deleteRowQuery = useMutation({
    mutationFn: DeleteCostCenter,
    onSuccess: (result) => {
      setTableData(result['data']['results']);
    }
  });
  // const columns = useMemo(
  //   () => [
  //     {
  //       header: 'Actions',
  //       size: 150,
  //       accessorKey: 'actions',
  //       Cell: ({ row }) => (
  //         <>
  //           <IconButton onClick={() => deleteCostcenter(row.original.item)} color="error">
  //             <Delete />
  //           </IconButton>
  //           <IconButton
  //             color="success"
  //             onClick={() => {
  //               navigate(row.original.item.id,{state:"view"});
  //             }}>
  //             <VisibilityIcon />
  //           </IconButton>

  //           <IconButton
  //             color="#e65100"
  //             onClick={() => {
  //               navigate(`/general-ledger/master-files/costcenter/edit/${row.original.item.id}`,{state:"edit"});
  //             }}>
  //             <EditIcon />
  //           </IconButton>
  //         </>
  //       )
  //     },


  //     {
  //       header: 'ID',
  //       accessorKey: 'item.costCenterNo',
  //       enableClickToCopy: true,
  //       size: 150,


  //     },

  //     {
  //       header: 'Name (Arabic)',
  //       accessorKey: 'item.nameAr',
  //       enableClickToCopy: true,
  //       size: 150,

  //       sx: {
  //         justifyContent: 'flex-start'
  //       }
  //     },
  //     {
  //       header: 'Name (English)',
  //       accessorKey: 'item.nameEn',
  //       enableClickToCopy: true,
  //       size: 150,
  //     }
  //   ],
  //   []
  // );

  const columns = [
    { title: 'ID', field: 'costCenterNo' },
    { title: 'Arabic Name', field: 'nameAr' },
    { title: 'English Name', field: 'nameEn' },
  ]


  const editInPage = (e, rowData) => {
    navigate(`/general-ledger/master-files/costcenter/${rowData.id}`, { state: "edit" });
  };

  const onRowClick = (e, rowData) => {
    navigate(`/general-ledger/master-files/costcenter/${rowData.id}`, { state: "view" });
  };

  const EditInRow = (newData, oldData) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log(newData)
        GetById(newData.id).then((res) => {
          console.log({ ...res.data, costCenterNo: newData.costCenterNo, nameAr: newData.nameAr, nameEn: newData.nameEn })
          Update({ costCenterId: newData.id, data: { ...res.data, costCenterNo: newData.costCenterNo, nameAr: newData.nameAr, nameEn: newData.nameEn } }).then(() => {
            getAll().then((result) => {
              setTableData(flattenArrayWithParentId(result))
              showToast("Edited Successfuly", 2000, "success");
            })
          }).catch((error) => {
            showToast(error.response.data.Message, 2000, "error");
          })
        })
        resolve();
      }, 0)
    })

  const deleteInRow = oldData =>
    new Promise(async (resolve, reject) => {
      setTimeout(() => {
        DeleteCostCenter(oldData.id).then(() => {
          getAll().then((res) => {
            setTableData(flattenArrayWithParentId(res))
            showToast("deleted Successfuly", 2000, "success");
          })
        }).catch((error) => {
          showToast(error.response.data.Message, 2000, "error");
        })
        resolve();
      }, 10)
    })

  //---------------------------------------------------------------------------------------------------------------------------------
  //Handel Export Excel Functionality

  const flattenedData = flattenData(dataToexport);

  

  const handleExportExcel = () => {
    showToast('Successfully Excel File Export!', 2000, 'success');

    ExcelExport({ data: flattenedData });
  };
  const handleCsv = () => {
    showToast('Successfully CSV File Export!', 2000, 'success');

    handleExportData();
  };



  
  const handleSaveSelectedCsv = () => {

    handleExportRows()
    if (exportSelectedButtonRef.current) {
      showToast('Successfully Selected CSV File Export!', 2000, 'success');

      exportSelectedButtonRef.current.click();
    }
  };

  //---------------------------------------------------------------------------------------------------------------------------------
  //Handel Adding Functionality
  const HandelNewPage = () => {
    navigate('/general-ledger/master-files/costcenter/add', { state: "add" });
  };

  //---------------------------------------------------------------------------------------------------------------------------------
  // PDF Functionality
  const handlePdf = () => {
    const doc = new jsPDF();
    doc.addFont('amiriri-regular.ttf', 'amiriri', 'normal');
    doc.setFont('amiriri');
    doc.setFontSize(14);
  
    // Add your title or any other content here
    doc.text('Cost Centers', 10, 20);
  
    const columnsForPdf = columns.map((col) => col.title);
  
    const dataForPdf = tableData.map((row) =>
    columns.map((col) => {
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
      startY: 30, 
    });
  
    doc.save('Cost Centers.pdf');
  };
  

  const addType = [{ name: 'Add', handler: HandelNewPage }];

  //---------------------------------------------------------------------------------------------------------------------------------

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
          // showToast("Successfully Deleted!", 2000, "success");

          const dataR = removeElement(tableData, itemId.id);
          setTableData(dataR);
        }
      } catch (error) {
        console.error('Error deleting cost center:', error);
      }
    },
    [deleteRowQuery]
  );

  // //Edite in Place
  // const editeCostcenter = async ({ exitEditingMode, row, values }) => {
  //   const { actions, 'item.nameAr': nameAr, 'item.nameEn': nameEn, ...dataToSend } = values;

  //   const newData = {
  //     nameAr,
  //     nameEn
  //   };

  //   exitEditingMode();
  // };

  //---------------------------------------------------------------------------------------------------------------------------------

  const staticHeaders = ['ID', 'Arbic Name', 'English Name'];
  //CSV Exports Functionality
  const csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: staticHeaders,
    filename: 'Cost Centers', // Set your custom filename here

  };
  const csvExporter = new ExportToCsv(csvOptions);

  //-----------------------------------------------------------------------------------------------------

  //Function to map all tree as flat data
  const generateFlattenedData = (row, depth, parentIndex) => {
    const newItem = {
      id: row.item.costCenterNo,
      nameAr: row.item.nameAr,
      nameEn: row.item.nameEn,
      // parent: parentIndex
    };
    return newItem;
  };

  

  //Export All data as csv
  const handleExportData = () => {
    const flattenedData = [];
    
    const flattenObject = (item, depth = 0, parentIndex = null) => {
      flattenedData.push(generateFlattenedData(item, depth, parentIndex));
      const currentItemIndex = flattenedData.length - 1;
      if (item.subRows && item.subRows.length > 0) {
        for (const subItem of item.subRows) {
          flattenObject(subItem, depth + 1, currentItemIndex);
        }
      }
    };
    for (const item of dataToexport) {
      flattenObject(item);
    }
    csvExporter.generateCsv(flattenedData);
  };




  // Export Only Selected data as csv
const handleExportRows = () => {

  const mapselectedData = (row) => {
    const newItem = {
      costCenterNo: row.costCenterNo,
      nameAr: row.nameAr,
      nameEn: row.nameEn,
    };
    return newItem;
  };
  
  // Map rowSelection to the flattened format
  const flattenedData = rowSelection.map((row) => mapselectedData(row));
  csvExporter.generateCsv(flattenedData);
};


  //---------------------------------------------------------------------------------------------------------------------------------

  const options = {
    actions: ['PDF', 'Excel', 'CSV','Selected CSV'],
    handler: handleSave
  };

  function handleSave(action) {
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
        handleSaveSelectedCsv(rowSelection);
        break;

      default:
        // Handle the case where action is not recognized
        break;
    }
  }
  const { isOpen, drawerWidth } = useSelector((state) => state.sidebar);





  return (


    <Box>
      {isLoading ? (
        <LoadingWrapper />
      ) : error ? (
        <ErrorWrapper />
      ) : (
        result && (

          <Box sx={{ backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#000' : '#153d77') }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginLeft: '20px',
                mb: "15px",
                alignItems: 'center',
                '@media (max-width: 600px)': {
                  flexDirection: isOpen ? 'column' : 'row'
                }
              }}>
              <PageTitle text="Cost Center" />

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginRight: '20px'
                }}>
                <Grid container alignItems="center" justifyContent="space-between">
                  <Grid item></Grid>
                </Grid>

                <DropdownButton
                  disabled={false}
                  options={{
                    actions: ['New'],
                    handler: function () {
                      navigate('/general-ledger/master-files/costcenter/add', { state: "add" });
                    }
                  }}
                  iconName="addCircle"
                  buttonColor={''}
                  hoverText={'Add New CostCenter'}

                />

                <DropdownButton buttonName="Export" options={options} iconName="export" 
                                  hoverText={'Export CostCenters'}

                />
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                '@media (max-width: 600px)': {
                  flexDirection: isOpen ? 'column' : 'row'
                }
              }}>
              <PathBreadcrumbs crumbs={location.pathname.substring(1).split('/')} />
            </Box>

            <ToastContainer />

            {/* <MaterialReactTable
        muiTableHeadCellProps={{
          sx: {
            fontWeight: 'bold',
            fontSize: '18px',
            color: '#153d77',
            backgroundColor: (theme) => theme.palette.mode == 'dark' && '#141619',
            color: (theme) => theme.palette.mode == 'dark' && '#fff'
          }
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
        muiTableBodyCellProps={{
          sx: {
            backgroundColor: (theme) => theme.palette.mode == 'dark' && '#141619',
            color: (theme) => theme.palette.mode == 'dark' && '#fff'
          }
        }}
        muiBottomToolbarProps={{
          sx: {
            backgroundColor: (theme) => theme.palette.mode == 'dark' && '#141619'
          }
        }}
        muiTopToolbarProps={{
          sx: {
            backgroundColor: (theme) => theme.palette.mode == 'dark' && '#141619'
          }
        }}
        muiTablePaginationProps={{
          sx: {
            color: (theme) => theme.palette.mode == 'dark' && '#fff'
          }
        }}
        muiTablePaperProps={{
          elevation: 0,
          sx: {
            borderRadius: '0',
            border: '1px dashed #e0e0e0'
          }
        }}
        muiTableBodyProps={{
          sx: (theme) => ({
            '& tr:hover td': {
              backgroundColor: (theme) => theme.palette.mode == 'dark' && '#4c3838'
            }
          })
        }}
        paginateExpandedRows={false}
        enableRowSelection
        positionToolbarAlertBanner="bottom"
        //Edite
        // editingMode="row"
        // enableEditing
        // onEditingRowSave={editeCostcenter}
        // enableColumnOrdering


        sx={{
          '& .MuiSvgIcon-root.MuiSvgIcon-fontSizeMedium': {
            display: 'inline-block',
            verticalAlign: 'middle',
            fontSize: '32px', // Set the desired size
            color: 'red', // Set the desired color
          },
          // Add any other styles you want to apply to the MaterialReactTable component
        }}


        muiTableBodyRowProps={({ row }) => ({
          sx: {
            backgroundColor: row.depth > 0 ? '#F7E7E7' : 'inherit',
          },
        })}

        state={{
          isLoading: isLoading
        }}
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
            <ValueTree editInPage={editInPage} handleEdit={EditInRow} handleRowClick={onRowClick} handleDelete={deleteInRow} data={tableData} col={columns} pageSize={20} 
                         multiSelect={true}
                         onSelectedRowsChange={handleSelectedRows} // Pass the callback function
            
            />

          </Box>

        )
      )}

    </Box>

  );
};
