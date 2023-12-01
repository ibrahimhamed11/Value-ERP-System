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
import { styled } from '@mui/material/styles';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { convertDataWithSubRows, removeElement, flattenData } from '../../../../utils/format';
import { Edit as EditIcon, Delete as DeleteIcon, AddBox as AddBoxIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import DropdownButton from '../../../../components/DropdownButton/DropDownButton';
import PathBreadcrumbs from '../../../../components/FormsUI/PathBreadcrumbs/index';
import { DeleteUser, getAll, getAllNum, GetById, updateUser } from '../api/users';
import { useSelector } from 'react-redux';
import PageTitle from '../../../../components/pageTitle/PageTitle';
import ValueTable from '../../../../components/ValueTable/ValueTable';
import { ToastContainer, toast } from 'react-toastify';
import showToast from '../../../../utils/toastMessage';
import ErrorMessageBox from '../../../../components/errorMsgBox/ErrorMessageBox ';
export const ListUser = () => {
  const exportSelectedButtonRef = useRef(null);
  const [tableData, setTableData] = useState([]);
  const [allUsers, setALlUsers] = useState([])
  const [pageCount, setPageCount] = useState(1)
  const [errorMessage, setErrorMessage] = useState('');

  //Fetch Data from BackEnd and change structure
  const { isLoading, error, data } = useQuery({
    queryKey: ['Users'],
    queryFn: getAll,
    onSuccess: (result) => {
      // result = convertDataWithSubRows(result);

      setTableData(result.data.results);
    },

  });
  useEffect(() => {
    getAllNum(1).then((res) => {
      setPageCount(res.data.pageCount);
      const allData = res.data.results; // Start with data from the first page

      // Fetch data for other pages in a loop
      const fetchPromises = [];
      for (let i = 2; i <= res.data.pageCount; i++) {
        fetchPromises.push(getAllNum(i));
      }

      Promise.all(fetchPromises).then((responses) => {
        // Concatenate data from all pages
        const additionalData = responses.map((res) => res.data.results).flat();
        const mergedData = allData.concat(additionalData);

        // Get the first and last elements

        setALlUsers(mergedData); // Set the state with all the data once

      });
    });
  }, []);







  //Delete Api
  const deleteRowQuery = useMutation({
    mutationFn: DeleteUser,
    onSuccess: (result) => {

      setTableData(result['data']['results']);
    }
  });





  const EditInRow = async (newData, oldData) => {
    try {
      await GetById(newData.id);

      const updatePayload = {
        firstName: newData.firstName,
        lastName: newData.lastName,
        email: newData.email,
      };
      await updateUser(newData.id, updatePayload);

      // Update the tableData state with the new data
      setTableData((prevTableData) => {
        const updatedTableData = prevTableData.map((item) =>
          item.id === newData.id ? { ...item, ...newData } : item
        );
        return updatedTableData;
      });

      // Handle success
      setErrorMessage("");
      showToast("Successfully updated", 2000, "success");

      setErrorMessage("");
    } catch (error) {
      console.error('Error during edit:', error);
      showToast(
        error.response?.data?.title || "An error occurred during the edit operation.",
        2000,
        "error"
      );
      setErrorMessage(
        error.response?.data?.title || "An error occurred during the edit operation."
      );
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };



  const deleteInRow = async (oldData) => {
    try {
      const shouldDelete = window.confirm(`Are you sure you want to delete User with Name: ${oldData.firstName}?`);

      if (shouldDelete) {
        const response = await DeleteUser(oldData.id);

        if (response.status === 200) {

          // Fetch updated data
          const updatedData = await getAll();
          setTableData(updatedData);

          // Trigger mutation (if needed)
          deleteRowQuery.mutate(oldData.id);

          const updatedTableData = tableData.filter(item => item.id !== oldData.id);
          setTableData(updatedTableData);

          showToast("Successfully Deleted!", 2000, "success");
          return Promise.resolve();
        }
      }
    } catch (error) {
      console.error("Error during delete:", error);

      if (error.response && error.response.data) {

        console.log(error.response.data.Message)
        showToast(error.response.data.Message, 2500, "error");
      } else {
        // Handle the error when response or data is not available
        showToast("An error occurred while deleting the user.", 2500, "error");
      }

      return Promise.reject();
    }
  };






  const AddInRow = (newData) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        setTableData([...tableData, newData]);

        resolve();
      }, 0)
    })

  const onRowClick = (e, rowData) => {
    navigate(`/administration/user/${rowData['id']}`, { state: "view" });
  };


  const editInPage = (event, rowData) => navigate(`/administration/edit/${rowData['id']}`, { state: "edit" });






  const columns = [
    { title: 'First Name', field: 'firstName' },
    { title: 'Last Name', field: 'lastName' },
    { title: 'Email', field: 'email' },
  ];


  const hideError = () => {
    setErrorMessage("");
  };


  // const columns = useMemo(
  //     () => [
  //         {
  //             id: 'editRow',
  //             header: 'Actions',
  //             columnDefType: 'display',
  //             size: 100,
  //             enableColumnOrdering: false,
  //             Cell: ({ row }) => (
  //                 <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '1px' }}>
  //                     <IconButton
  //                         color="secondary"
  //                         onClick={() => {
  //                             navigate(`edit/${row.original.id}`,{state:"edit"});
  //                         }}>
  //                         <EditIcon />
  //                     </IconButton>{' '}
  //                     <IconButton
  //                         color="error"
  //                         onClick={async () => {
  //                             if (window.confirm(`Are you sure you want to delete item with ID: ${row.original.id}?`)) {
  //                                 try {
  //                                     const response = await Delete(row.original.id);
  //                                     if (response.status === 200) {
  //                                         // Delete was successful

  //                                         // Fetch updated data
  //                                         const updatedData = await GetAll();
  //                                         setTableData(updatedData);

  //                                         // Trigger mutation (if needed)
  //                                         deleteRowQuery.mutate(row.original.id);

  //                                         // Remove the deleted item from the local state (if applicable)
  //                                         const updatedTableData = tableData.filter(item => item.id !== row.original.id);
  //                                         setTableData(updatedTableData);

  //                                         showToast("Successfully Deleted!", 2000, "success");
  //                                     }
  //                                 } catch (error) {
  //                                     showToast(error.response.data.Message, 2500, "error");
  //                                 }
  //                             }
  //                         }}
  //                     >
  //                         <DeleteIcon />
  //                     </IconButton>
  //                     <IconButton
  //                         color="success"
  //                         onClick={() => {
  //                             navigate(`${row.original.id}`,{state:"view"});
  //                         }}>
  //                         <VisibilityIcon />
  //                     </IconButton>
  //                 </Box>
  //             )
  //         },
  //         {
  //             header: 'First',
  //             accessorKey: 'firstName',
  //             enableClickToCopy: true,

  //             sx: {
  //                 justifyContent: 'flex-start'
  //             }
  //         },
  //         {
  //             header: 'Last Name',
  //             accessorKey: 'lastName',
  //             enableClickToCopy: true,

  //             sx: {
  //                 justifyContent: 'flex-start'
  //             }
  //         },

  //     ],
  //     []
  // );
  const navigate = useNavigate();

  //---------------------------------------------------------------------------------------------------------------------------------
  //Handel Adding Functionality
  const handelInPage = () => {
    confirm('Modal')
  };
  const HandelNewPage = () => {
    navigate('add', { state: "add" });
  };
  const HandelEdit = () => {
    console.log(tableData[Object.keys(rowSelection)[0]]);
    navigate(`edit/${tableData[Object.keys(rowSelection)[0]].id}`, { state: "edit" });
  };
  const HandelDelete = () => {

  };
  const { isOpen, drawerWidth } = useSelector((state) => state.sidebar);
  //---------------------------------------------------------------------------------------------------------------------------------
  return (
    <Box sx={{ flexDirection: 'column', backgroundColor: (theme) => theme.palette.mode == "dark" ? "#000" : "#153d77" }}>
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

      <Box sx={{ marginX: '0px', marginY: '0' }}>
        <PageTitle text="Users" />
      </Box>

      <Box
        sx={{
          marginRight: '20px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'inherit',
          flexWrap: 'wrap',
          
        }}>
        <>
        







<DropdownButton
                disabled={false}
                options={{
                  actions: ['Add'],
                  handler: HandelNewPage
                }}
                iconName="addCircle"
                buttonColor={''}
              />
   









        </>
      </Box>
    </Box>
    <Box
      sx={{
        marginX: '0px',
        marginY: '0',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: '0px',
        alignItems: 'center',
        '@media (max-width: 500px)': {
          flexDirection: isOpen ? 'row' : 'column'
        }
      }}>
      <PathBreadcrumbs crumbs={location.pathname.substring(1).split('/')} />
    </Box>


      <ErrorMessageBox errorMessage={errorMessage} onClose={hideError} />

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
        data={allUsers}

        filterFromLeafRows
        initialState={{
          expanded: true,
          density: 'compact'
        }}
        paginateExpandedRows={false}
        // enableRowSelection
        // onRowSelectionChange={setRowSelection}
        // state={{ rowSelection }}
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
            // startIcon={<FileDownloadIcon />}
            variant="contained"
            style={{
              display: 'none'
            }}>
            Export Selected Rows{' '}
          </Button>
        )}
      /> */}


      <ValueTable col={columns} data={tableData} handleEdit={EditInRow} handleDelete={deleteInRow} handleAdd={AddInRow} handleRowClick={onRowClick} editInPage={editInPage} multiSelect={true} pageSize={10} />
      </Box>

  );
};
