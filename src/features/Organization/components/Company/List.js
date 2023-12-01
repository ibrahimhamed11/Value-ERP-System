import React, { useEffect, useRef, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { MaterialReactTable } from 'material-react-table';
import { useLocation } from 'react-router-dom';
import { Box, Button, IconButton, darken, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom/dist';
import { EditNote as EditIcon, Delete as DeleteIcon, AddBox as AddBoxIcon } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Delete, GetAll,getAllLookup, Update,GetById,AddCompany } from '../../api/company';
import PathBreadcrumbs from '../../../../components/FormsUI/PathBreadcrumbs';
import { useSelector } from 'react-redux';
import PageTitle from '../../../../components/pageTitle/PageTitle';
import DropdownButton from '../../../../components/DropdownButton/DropDownButton';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import showToast from '../../../../utils/toastMessage';
import LoadingWrapper from '../../../../components/Loading';
import ErrorWrapper from '../../../../components/Error';
import ValueTable from '../../../../components/ValueTable/ValueTable';




export const List = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error, data: result } = useQuery({
    queryKey: ['companies'],
    queryFn: getAllLookup,

    onSuccess: (result) => {
      setTableData(result);
    }
  });





  const saveRowQuery = useMutation({
    mutationFn: Update,
    onSuccess: (result) => {
      setTableData(result['data']['results']);
    }
  });

  const deleteRowQuery = useMutation({
    mutationFn: Delete,
    onSuccess: (result) => {
      setTableData(result['data']['results']);
    }
  });

  const [rowSelection, setRowSelection] = useState({});
  const tableInstanceRef = useRef(null);
  const [tableData, setTableData] = useState([]);
  const { isOpen, drawerWidth } = useSelector((state) => state.sidebar);

  const onRowClick = (e, rowData) => {
    navigate(`/organization/company/${rowData['id']}`, { state: "view" });
  };




    //---------------------------------------------------------------------
    const EditInRow = async (newData, oldData) => {
      try {


       // Fetch the role data by ID
        const roleData = await GetById(newData.id);
    
        // Prepare the update payload
        const updatePayload = {
          nameAr: newData.nameAr,
          nameEn: newData.nameEn,
          notes: roleData.notes,
        };
    
        // Update the company data with the new values
        const response = await Update({ data: updatePayload, id: newData.id });
    
        setTableData((prevTableData) =>
          prevTableData.map((item) =>
            item.id === newData.id ? { ...item, ...newData } : item
          )
        );
    
        // Log the response data
        showToast('Successfully updated', 2000, 'success');

        // setErrorMessage('');
      } catch (error) {
        // Handle errors
        // console.error('Error during edit:', error);
    
        // Extract error message from the response or use a default message
        const errorMessage =
          error.response?.data || 'An error occurred during the edit operation.';
    
        // Use consistent error handling
        // setErrorMessage(errorMessage);
        showToast(errorMessage, 2000, 'error');
    
        setTimeout(() => {
          // Clear error message after a delay if needed
          // setErrorMessage('');
        }, 3000);
      }
    };
    
    const AddInRow = async (newData) =>
    new Promise(async (resolve, reject) => {
      try {
        const response = await AddCompany(newData);
  
        if (response.status === 200) {
          setTableData((prevTableData) => [...prevTableData, newData]);
  
          showToast('Row added successfully!', 2000, 'success');
  
          resolve();
        }
      } catch (error) {
        // Handle any errors that occur during the API call
  
        // Log the error to the console
        console.error('Error adding row:', error);
        const err = Object.keys(error.response.data.errors)[0];
  
        // Show an error toast
        const errorMessage = error.response?.data?.Message || `${error.response.data.errors[`${err}`]}`;
        showToast(errorMessage, 2000, 'error');
  
        // Reject the promise to indicate that the addition failed
        reject();
      }
    });
  
    
  const editInPage = (event, rowData) => navigate(`/organization/company/edit/${rowData['id']}`, { state: "edit" });
  const deleteInRow = oldData =>
    new Promise(async (resolve, reject) => {
      console.log(oldData);
      if (window.confirm(`Are you sure you want to delete item with Name: ${oldData.nameEn}?`)) {
        try {
          const response = await Delete(oldData.id);
          if (response.status === 200) {
            // Delete was successful

            // Fetch updated data
            const updatedData = await GetAll();
            setTableData(updatedData);

            // Trigger mutation (if needed)
            deleteRowQuery.mutate(oldData.id);

            // Remove the deleted item from the local state (if applicable)
            const updatedTableData = tableData.filter(item => item.id !== oldData.id);
            setTableData(updatedTableData);

            showToast("Successfully Deleted!", 2000, "success");
            resolve()
          }
        } catch (error) {
          showToast(error.response.data.Message, 2500, "error");
          reject();
        }
      }

    })
    
  const columns = [
    { title: 'Arabic Name', field: 'nameAr' },
    { title: 'English Name', field: 'nameEn' },
  ]



  // const columns = [
  //   {
  //     id: 'editRow',
  //     header: 'Actions',
  //     columnDefType: 'display',
  //     size: 100,
  //     enableColumnOrdering: false,
  //     Cell: ({ row }) => (
  //       <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
  //         <IconButton
  //           color="secondary"
  //           onClick={() => {
  //             navigate(`/organization/company/edit/${row['id']}`, { state: "edit" });
  //           }}>
  //           <EditIcon />
  //         </IconButton>{' '}
  //         <IconButton
  //           color="error"

  //           onClick={async () => {
  //             if (window.confirm(`Are you sure you want to delete item with Name: ${row.original.nameEn}?`)) {
  //               try {
  //                 const response = await Delete(row.original.id);
  //                 if (response.status === 200) {
  //                   // Delete was successful

  //                   // Fetch updated data
  //                   const updatedData = await GetAll();
  //                   setTableData(updatedData);

  //                   // Trigger mutation (if needed)
  //                   deleteRowQuery.mutate(row.original.id);

  //                   // Remove the deleted item from the local state (if applicable)
  //                   const updatedTableData = tableData.filter(item => item.id !== row.original.id);
  //                   setTableData(updatedTableData);

  //                   showToast("Successfully Deleted!", 2000, "success");
  //                 }
  //               } catch (error) {
  //                 showToast(error.response.data.Message, 2500, "error");
  //               }
  //             }
  //           }}


  //         >


  //           <DeleteIcon />
  //         </IconButton>
  //         <IconButton
  //           color="success"
  //           onClick={() => {
  //             navigate(`/organization/company/${row['id']}`, { state: "view" });
  //           }}>
  //           <VisibilityIcon />
  //         </IconButton>
  //       </Box>
  //     )
  //   },

  //   {
  //     accessorKey: 'nameAr',
  //     header: 'Arabic Name'
  //   },
  //   {
  //     accessorKey: 'nameEn',
  //     header: 'English Name'
  //   },

  // ];



  const handleSaveRow = async ({ exitEditingMode, row, values }) => {
    const merge = (...objects) => objects.reduce((acc, cur) => ({ ...acc, ...cur }));
    tableData[row.index] = merge(tableData[row.index], values);
    saveRowQuery.mutate({ payload: values, rowId: row['id'] });
    setTableData([...tableData]);

    exitEditingMode();
  };




  return (


    <Box>
      {isLoading ? (
        <LoadingWrapper />
      ) : error ? (
        <ErrorWrapper />
      ) : (
        result && (

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



              <PageTitle text="Companies" />





              <Box sx={{ display: "flex", marginRight: "20px" }}>
                <Grid alignItems="center" justifyContent="space-between" >



                  <Grid item>
                    <Box sx={{ display: "flex" }}>

                      <DropdownButton
                        disabled={false}
                        options={{
                          actions: ['New'],
                          handler: function () {
                            navigate('/organization/company/add', { state: "add" });

                          }
                        }}
                        iconName="addCircle"
                        buttonColor={''}
                        hoverText={'Add New company'}

                      />
                    </Box>

                  </Grid>
                </Grid>
                {/* <DropdownButton buttonName="Export" options={optionss} iconName="export" /> */}
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
              <ToastContainer />

            </Box>

            <ValueTable col={columns} data={tableData} handleEdit={EditInRow} handleDelete={deleteInRow} handleAdd={AddInRow} handleRowClick={onRowClick} editInPage={editInPage} pageSize={20}/>

          </Box>

        )
      )}

    </Box>
  );
};
