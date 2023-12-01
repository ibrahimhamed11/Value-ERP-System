import { useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import React, { useCallback, useState, useEffect } from 'react';
import { Button, IconButton, Box, Grid, Typography } from '@mui/material';
import { Delete as DeleteIcon, AddBox as AddBoxIcon } from '@mui/icons-material';
import DropdownButton from '../../../../components/DropdownButton/DropDownButton';
import { styled } from '@mui/material/styles';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { convertDataWithSubRows, removeElement, flattenData } from '../../../../utils/format';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete,
  FileDownload as FileDownloadIcon
} from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import showToast from '../../../../utils/toastMessage';

import PathBreadcrumbs from '../../../../components/FormsUI/PathBreadcrumbs';
import { DeleteRoleByid, getAllRule, GetById, Update } from '../api/rules';
import { useSelector } from 'react-redux';
import ValueTable from '../../../../components/ValueTable/ValueTable';
import 'react-toastify/dist/ReactToastify.css';
import PageTitle from '../../../../components/pageTitle/PageTitle';

export const List = () => {
  const [rowSelection, setRowSelection] = useState({});
  const [isEditDisable, setIsEditDisable] = useState(true);
  const [isDeleteDisable, setIsDeleteDisable] = useState(true);
  const exportSelectedButtonRef = useRef(null);
  const [tableData, setTableData] = useState([]);

  //Fetch Data from BackEnd and change structure
  const { isLoading, error, data } = useQuery({
    queryKey: ['Rules'],
    queryFn: getAllRule,
    onSuccess: (result) => {
      console.log(result);
      // result = convertDataWithSubRows(result);

      setTableData(result.data.results);
    }
  });
  //Delete Api
  const deleteRowQuery = useMutation({
    mutationFn: DeleteRoleByid,
    onSuccess: (result) => {
      setTableData(result['data']['results']);
    }
  });
  // const deleteRole = useCallback(
  //     async (itemId) => {
  //         if (
  //             !window.confirm(
  //                 `Are you sure you want to delete item with ID: ${itemId.nameEn}? and this element id is: ${itemId.id}`
  //             )
  //         ) {
  //             return;
  //         }
  //         try {
  //             const response = await deleteRowQuery.mutateAsync(itemId.id);
  //             if (response.status == 200) {
  //                 const dataR = removeElement(tableData, itemId.id);
  //                 setTableData(dataR);
  //             }
  //         } catch (error) {
  //             console.error('Error deleting cost center:', error);
  //         }
  //     },
  //     [deleteRowQuery]
  // );

  // const columns = useMemo(
  //     () => [
  //         {
  //             header: 'Name of Rule',
  //             accessorKey: 'roleName',
  //             enableClickToCopy: true,

  //             sx: {
  //                 justifyContent: 'flex-start'
  //             }
  //         },
  //         {
  //             enableEditing: false,

  //             accessorKey: 'actions',
  //             Cell: ({ row }) => (
  //                 <>
  //                     <IconButton onClick={() => deleteRole(row.original)} color="error">
  //                         <Delete />
  //                     </IconButton>
  //                     <IconButton
  //                         color="success"
  //                         onClick={() => {
  //                             navigate(row.original.id,{state:"view"});
  //                         }}>
  //                         <VisibilityIcon />
  //                     </IconButton>

  //                     <IconButton
  //                         color="#e65100"
  //                         onClick={() => {
  //                             navigate(`edit/${row.original.id}`,{state:"edit"});
  //                         }}>
  //                         <EditIcon />
  //                     </IconButton>
  //                 </>
  //             )
  //         },

  //     ],
  //     []
  // );

  //---------------------------------------------------------------------
  const EditInRow = async (newData, oldData) => {
    try {
      // Fetch the role data by ID
      const roleData = GetById(newData.id).then((res) => {
        console.log(res);
        const updatePayload = {
          name: newData.roleName,
          permissions: res.data.permissions
        };
        const response = Update({ data: updatePayload, id: newData.id }).then((res) => {
          showToast('Successfully updated', 2000, 'success');

          setTableData((prevTableData) => {
            const updatedTableData = prevTableData.map((item) =>
              item.id === newData.id ? { ...item, ...newData } : item
            );
            return updatedTableData;
          });

          // Handle success
          setErrorMessage('');
        });
      });

      // Prepare the update payload

      // Update the role data with the new values
    } catch (error) {
      console.error('Error during edit:', error);

      // Handle errors
      const errorMessage =
        error.response?.data?.title || 'An error occurred during the edit operation.';

      showToast(errorMessage, 2000, 'error');
    }
  };

  const deleteInRow = async (itemId) => {
    try {
      const shouldDelete = window.confirm(
        `Are you sure you want to delete Role with Name: ${itemId.roleName}?`
      );

      if (shouldDelete) {
        const response = await deleteRowQuery.mutateAsync(itemId.id);

        if (response.status === 200) {
          const dataR = removeElement(tableData, itemId.id);
          setTableData(dataR);

          showToast('Successfully Deleted!', 2000, 'success');
          return Promise.resolve();
        }
      }
    } catch (error) {
      console.error('Error during delete:', error);

      if (error.response && error.response.data) {
        console.log(error.response.data.Message);
        showToast(error.response.data.Message, 2500, 'error');
      } else {
        showToast('An error occurred while deleting the user.', 2500, 'error');
      }

      return Promise.reject();
    }
  };

  //   const AddInRow = (newData) =>
  //   new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       setTableData([...tableData, newData]);

  //       resolve();
  //     }, 0)
  //   })

  const onRowClick = (e, rowData) => {
    navigate(`/administration/role/${rowData['id']}`, { state: 'view' });
  };

  const editInPage = (event, rowData) =>
    navigate(`/administration/edit/${rowData['id']}`, { state: 'edit' });

  const columns = [{ title: 'Role Name', field: 'roleName' }];

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
    confirm('Modal');
  };
  const HandelNewPage = () => {
    navigate('add', { state: 'add' });
  };

  //---------------------------------------------------------------------------------------------------------------------------------

  const deleteRule = useCallback(
    async (itemId) => {
      if (
        !window.confirm(
          `Are you sure you want to delete item with ID: ${itemId}? and this element id is: ${itemId}`
        )
      ) {
        return;
      }

      try {
        console.log(itemId.id);
        // const response = await deleteRowQuery.mutateAsync(itemId.id);
        // if (response.status == 200) {
        //     // showToast("Successfully Deleted!", 2000, "success");

        //     const dataR = removeElement(tableData, itemId.id);
        //     setTableData(dataR);
        //     confirm('deleted done');
        // }
      } catch (error) {
        console.error('Error deleting cost center:', error);
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

    console.log(newData);

    exitEditingMode();
  };

  //---------------------------------------------------------------------------------------------------------------------------------
  // const exportType = [
  //     {
  //         name: 'PDF',
  //         handler: handlePdf
  //     },
  //     {
  //         name: 'Excel',
  //         handler: handleExportExcel
  //     },
  //     {
  //         name: 'CSV',
  //         handler: handleCsv
  //     },
  //     {
  //         name: 'Seleted As CSV',
  //         handler: handleSaveSelectedCsv
  //     }
  // ];
  const { isOpen, drawerWidth } = useSelector((state) => state.sidebar);

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
        <PageTitle text="Role" />
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
                data={tableData}
                enableExpandAll={false}
                setRowSelection={setRowSelection}
                filterFromLeafRows
                paginateExpandedRows={false}
                enableRowSelection
                positionToolbarAlertBanner="bottom"
                //Edite
                editingMode="row"
                enableEditing
                onEditingRowSave={editeCostcenter}
                enableColumnOrdering
                initialState={{
                    expanded: false,
                    density: 'compact'
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

      <ValueTable
        col={columns}
        data={tableData}
        handleEdit={EditInRow}
        handleDelete={deleteInRow}
        handleRowClick={onRowClick}
        editInPage={editInPage}
        multiSelect={true}
        pageSize={10}
      />
            </Box>

  );
};
