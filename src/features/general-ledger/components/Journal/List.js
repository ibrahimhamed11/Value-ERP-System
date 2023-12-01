import { useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import React, { useCallback, useState, useEffect } from 'react';
import moment from 'moment';
import {
  Button,
  IconButton,
  Box,
  Grid,
  Typography
} from '@mui/material';
import DropdownButton from '../../../../components/DropdownButton/DropDownButton';
import { styled } from '@mui/material/styles';
import { ExportToCsv } from 'export-to-csv';
import { useRef } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ExcelExport } from './Excel';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getAll, DeleteJournal, GetById, Update, getCostCenterById } from '../../api/journal';
import { convertDataWithSubRows, removeElement, flatJournal } from '../../../../utils/format';
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
import ValueTable from '../../../../components/ValueTable/ValueTable';
import { Details } from '@material-ui/icons';


export const List = () => {
  const exportSelectedButtonRef = useRef(null);
  const [journal, setJournal] = useState([])
  const [dataToexport, setdataToexport] = useState([]);

  const [rowSelection, setRowSelection] = useState({});



  const handleSelectedRows = (rows) => {
      setRowSelection(rows)

  };


  const options = {
    actions: ['PDF', 'Excel', 'CSV', 'Selected CSV'],
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
        handleSaveSelectedCsv();
        break;

      default:
        // Handle the case where action is not recognized
        break;
    }
  }



  
  const columns = [
    { title: 'ID', field: 'serialNo', editable: false },
    { title: 'Description', field: 'description' },
    { title: 'Reference', field: 'reference' },
    { title: 'Source Type', field: 'sourceType' },
    { title: 'Source Application', field: 'sourceApplication', editable: false },
    {
      title: 'Creation Time', field: 'creationTime', editable: false, render: rowData => {
        const parsedDate = moment(rowData.creationTime);

        if (parsedDate.isValid()) {
          return parsedDate.format('MMMM D, YYYY HH:mm');
        } else {
          return 'Invalid Date';
        }
      },
    },
  ]

  //---------------------------------------------------------------------------------------------------------------------------------
  //Handel Export Excel Functionality



  //---------------------------------------------------------------------------------------------------------------------------------

  //CSV Exports Functionality
  const staticHeaders = ['id', 'reference', "entryTypeId", "sourceType", "balanceTypeId", "CreationTime"];

  const csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: staticHeaders,
    filename: 'Journal', 

  };
  const csvExporter = new ExportToCsv(csvOptions);
  //Export All data as csv
  const handleExportData = () => {
    const flattenedData = flatJournal(journal);
    csvExporter.generateCsv(flattenedData);
  };


    //Export All data as csv
    const handleExportSelectedData = () => {
      const flattenedData = flatJournal(rowSelection);
      csvExporter.generateCsv(flattenedData);
    };
  

  //---------------------------------------------------------------------------------------------------------------------------------


    // PDF Functionality

    const handlePdf = () => {
      const doc = new jsPDF();
      doc.addFont('amiriri-regular.ttf', 'amiriri', 'normal');
      doc.setFont('amiriri');
      doc.setFontSize(64);
    
      const columnsForPdf = columns.map((col) => col.title);
    
      const dataForPdf = journal.map((row) =>
        columns.map((col) => {
          const accessorKey = col.field; 
          const accessorKeys = accessorKey.split('.');
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
      });
    
      if (doc.save('Journal.pdf')) {
        showToast('Successfully PDF File Export!', 2000, 'success');
      }
    };
     //---------------------------------------------------------------------------------------------------------------------------------
  //Handel Export Excel Functionality
  const flattenedData = flatJournal(journal);
  const handleExportExcel = () => {
    showToast('Successfully Excel File Export!', 2000, 'success');

    ExcelExport({ data: flattenedData });
  };
  const handleCsv = () => {
    showToast('Successfully CSV File Export!', 2000, 'success');

    handleExportData();
  };
  const handleSaveSelectedCsv = () => {
    
      handleExportSelectedData();
      showToast('Successfully Selected CSV File Export!', 2000, 'success');

  
  };
    
  const onRowClick = (e, rowData) => {
    navigate(`/general-ledger/transactions/journal/view/${rowData.id}`, { state: "view" });
  };
  const editInPage = (e, rowData) => {
    navigate(`/general-ledger/transactions/journal/edit/${rowData.id}`, { state: "edit" });
  };
  const EditInRow = (newData, oldData) =>
    new Promise(async (resolve, reject) => {
      try {
        setTimeout(async () => {
          const res = await GetById(newData.id)
          let journalDetails = []
          for (let i = 0; i < res.data.journalDetails.length; i++) {
            let obj = {}
            obj["glAccountId"] = res.data.journalDetails[i].glAccountId
            if(res.data.journalDetails[i].credit > res.data.journalDetails[i].debit){
              obj["credit"] = res.data.journalDetails[i].credit
            }
            else{
              obj["debit"] = res.data.journalDetails[i].debit
            }
            obj["description"] = res.data.journalDetails[i].description
            let costCenters = []
            for (let j = 0; j < res.data.journalDetails[i].journalDetailCostCenters.length; j++) {
              let obj2 = {}
              obj2["costCenterId"] = res.data.journalDetails[i].journalDetailCostCenters[j].costCenterId
              let result = await getCostCenterById(res.data.journalDetails[i].journalDetailCostCenters[j].costCenterId)
              obj2["costCenterCategoryId"] = result.data.costCenterCategoryId
              obj2["amount"] = res.data.journalDetails[i].journalDetailCostCenters[j].amount
              costCenters.push(obj2)
            }
            obj["costCenters"] = costCenters
            journalDetails.push(obj)
          }


          let payload = {
            description:newData.description,
            year:newData.year,
            reference:newData.reference,
            entryTypeId:newData.entryTypeId,
            sourceType:newData.sourceType,
            balanceTypeId:newData.balanceTypeId,
            sourceApplication:newData.sourceApplication,
            journalDetails:journalDetails
          }
          Update({ journalId: newData.id, data: payload }).then(() => {
            getAll().then((res) => {
              setJournal(res)
              setdataToexport(res)
              showToast('Edited Successfully', 2000, 'success');

            })
          })
          resolve();
        }, 0);
      } catch (error) {
      }
    });

    const deleteInRow = oldData =>
    new Promise(async (resolve, reject) => {
      setTimeout(() => {
        console.log(oldData)
        DeleteJournal([oldData.id]).then(() => {
          getAll().then((res) => {
            setJournal(res)
            showToast('Deleted Successfully', 2000, 'success');
          })
        }).catch((error) => {
          showToast(error.response.data.Message, 2000, "error");
        })
        resolve();
      }, 10)
    })
  // const columns = useMemo(
  //   () => [
  //     {
  //       enableEditing: false,
  //       maxSize: 10,

  //       accessorKey: 'actions',
  //       Cell: ({ row }) => (
  //         <>
  //           <IconButton color="error" onClick={() => {
  //             console.log([row.original.id])
  //             DeleteJournal([row.original.id]).then(() => {
  //               showToast("journal Deleted successfully", 2000, "success");
  //               getAll().then((res) => {
  //                 setJournal(res)
  //               })
  //             })
  //           }}>
  //             <Delete />
  //           </IconButton>

  //           <IconButton
  //             color="success"
  //             onClick={() => {
  //               navigate(`/general-ledger/transactions/journal/view/${row.original.id}`,{state:"view"})
  //             }}>
  //             <VisibilityIcon />
  //           </IconButton>

  //           <IconButton
  //             color="#e65100"
  //             onClick={() => {
  //               navigate(`/general-ledger/transactions/journal/edit/${row.original.id}`,{state:"edit"})
  //             }}>
  //             <EditIcon />
  //           </IconButton>
  //         </>
  //       )
  //     },
  //     {
  //       header: 'ID',
  //       accessorKey: 'serialNo',
  //       enableClickToCopy: true,
  //       maxSize: 10,
  //     },
  //     {
  //       header: 'Description',
  //       accessorKey: 'description',
  //       enableClickToCopy: true,
  //       maxSize: 10,
  //       sx: {
  //         justifyContent: 'flex-start'
  //       }
  //     },
  //     {
  //       header: 'Reference',
  //       accessorKey: 'reference',
  //       maxSize: 10,
  //       enableClickToCopy: true
  //     },

  //     {
  //       header: 'Source Type',
  //       accessorKey: 'sourceType',
  //       maxSize: 10,
  //       enableClickToCopy: true
  //     },
  //     {
  //       header: 'Source Application',
  //       accessorKey: 'sourceApplication',
  //       maxSize: 10,
  //       enableClickToCopy: true
  //     },

  //     {
  //       header: 'Creation Time',
  //       accessorKey: 'creationTime',
  //       maxSize: 10,
  //       enableClickToCopy: true,
  //       Cell: ({ row }) => {
  //         const parsedDate = moment(row.original.creationTime);

  //         if (parsedDate.isValid()) {
  //           const formattedCreationTime = parsedDate.format('MMMM D, YYYY HH:mm');

  //           return <span>{formattedCreationTime}</span>;
  //         } else {
  //           return <span>Invalid Date</span>;
  //         }
  //       },
  //     },
  //   ],
  //   []
  // );
  const navigate = useNavigate();
  //Buttons Styles
  const StyledContainer = styled('div')({
    direction: 'rtl',
    marginBottom: '1%',
    marginRight: '1%',
    marginTop: '1%',
    '@media (max-width: 768px)': {
      marginBottom: '1%',
      marginRight: '1%'
    }
  });
  const ButtonWrapper = styled('div')({
    display: 'flex',
    alignItems: 'center'
  });
  const SpaceBetweenButtons = styled('div')({
    marginRight: '10px'
  });

 
  //---------------------------------------------------------------------------------------------------------------------------------
  //Handel Adding Functionality
  const handelInPage = () => {
    confirm('Modal')
  };
  const HandelNewPage = () => {
    navigate('/general-ledger/transactions/journal/add', { state: "add" });
  };










  const { isLoading, error, data: result } = useQuery({
    queryKey: ['Journal'],
    queryFn: getAll,
    onSuccess: (result) => {
      setJournal(result);
    }
  });



  const { isOpen, drawerWidth } = useSelector((state) => state.sidebar);
  return (

    <Box>
      {isLoading ? (
        <LoadingWrapper />
      ) : error ? (
        <ErrorWrapper />
      ) : (
        result && (
          <Box sx={{ backgroundColor: (theme) => theme.palette.mode === 'dark' ? "#000" : "#153d77" }}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginLeft: '20px',
              mb: "15px",
              alignItems: "center",
              '@media (max-width: 600px)': {
                flexDirection: isOpen ? 'column' : 'row'
              },
            }}>
              <PageTitle text="Journal" />
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginRight: "20px" }}>
                <Grid container alignItems="center" justifyContent="space-between">
                  <Grid item container>

                    <DropdownButton
                      disabled={false}
                      options={{
                        actions: ['Add'],
                        handler: function () {
                          navigate('/general-ledger/transactions/journal/add', { state: "add" });
                        }
                      }}
                      iconName="addCircle"
                      buttonColor={''}
                      hoverText={'Add New Journal'}

                    />
                    <DropdownButton
                      disabled={Object.keys(rowSelection).length === 0}
                      options={{
                        actions: ['Delete'],
                        handler: function () {
                          const indexes = Object.keys(rowSelection).map(Number);
                          const deleted = indexes.map(index => journal[index])
                          const ids = deleted.map(obj => obj?.id)
                          if (!window.confirm("Are You Sure You Want To Delete These Journals")) {
                            return
                          }
                          else {
                            DeleteJournal(ids).then(() => {
                              setRowSelection([])
                              showToast("journal Deleted successfully", 2000, "success");
                              getAll().then((res) => {
                                setJournal(res)
                              })
                            }).catch((e) => {
                              console.log(e)
                            })
                          }
                        }
                      }}
                      iconName="delete"
                      buttonColor={'red'}
                      hoverText={'Multi Delete Journal'}

                    />

                  </Grid>
                </Grid>
                <DropdownButton buttonName="Export" options={options} iconName="export" 
                                      hoverText={'Export data options'}

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
              <PathBreadcrumbs crumbs={location.pathname.substring(1).split('/')} />

            </Box>

            <ToastContainer />
            {/* <MaterialReactTable
        muiTableHeadCellProps={{
          sx: {
            fontWeight: 'bold',
            fontSize: '18px',
            color: '#153d77',
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
        muiTablePaginationProps={{
          sx: {

            color: (theme) => theme.palette.mode == "dark" && "#fff",
          }
        }}
        muiTablePaperProps={{
          elevation: 0,
          sx: {
            borderRadius: '0',
            border: '1px dashed #e0e0e0',
          },
        }}

        muiTableBodyProps={{
          sx: (theme) => ({
            '& tr:hover td': {
              backgroundColor: (theme) => theme.palette.mode == "dark" && "#4c3838"
            }
          })
        }}

        columns={columns}
        data={journal}

        filterFromLeafRows
        initialState={{
          expanded: true,
          density: 'compact'
        }}
        paginateExpandedRows={false}
        enableRowSelection
        onRowSelectionChange={setRowSelection}
        state={{ rowSelection }}
        getRowId={(originalRow) => originalRow.Id}
        positionToolbarAlertBanner="bottom"
        //Edite
        editingMode="row"
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
      /> */}


            <ValueTable col={columns}
             data={journal} 
             handleRowClick={onRowClick} 
             editInPage={editInPage} 
             handleEdit={EditInRow} 
             handleDelete={deleteInRow} 
             multiSelect={true}
             onSelectedRowsChange={handleSelectedRows} // Pass the callback function
             />

          </Box>
        )
      )}

    </Box>
  );
};
