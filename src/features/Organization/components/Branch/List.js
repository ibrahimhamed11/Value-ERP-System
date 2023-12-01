import React, { useEffect, useRef, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { columns as cols, Data } from './data';
import { Edit as EditIcon, Delete as DeleteIcon, AddBox as AddBoxIcon } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom/dist';
import DropdownButton from '../../../../components/DropdownButton/DropDownButton';
import ButtonWrapper from '../../../../components/IconButton';
import { Delete, GetAll, Update, GetById } from '../../api/Branch';
import PathBreadcrumbs from '../../../../components/FormsUI/PathBreadcrumbs';
import showToast from '../../../../utils/toastMessage';
import MaterialTableList from '../../../../components/MaterialTable/List';
import { useSelector } from 'react-redux';
import PageTitle from '../../../../components/pageTitle/PageTitle';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingWrapper from '../../../../components/Loading';
import ErrorWrapper from '../../../../components/Error';
import ValueTable from '../../../../components/ValueTable/ValueTable';

export const List = () => {
  const actions = { save: 'save', edit: 'edit', del: 'delete', new: 'new', view: 'view' };
  const {
    isLoading,
    error,
    data: result
  } = useQuery({
    queryKey: ['Branches'],
    queryFn: GetAll,
    onSuccess: (result) => {
      console.log(result['data']['results']);
      setTableData(result?.data['results']);
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
  const [isEditDisable, setIsEditDisable] = useState(true);
  const [isDeleteDisable, setIsDeleteDisable] = useState(true);
  const tableInstanceRef = useRef(null);
  const [tableData, setTableData] = useState([]);

  const navigate = useNavigate();

  const location = useLocation();
  function addNew() {
    navigate('/organization/branch/add', { state: 'add' });
  }
  function edit() {
    const selectedRows = Object.entries(rowSelection).filter((entry) => entry[1]);
    navigate(`/organization/branch/Edit/${selectedRows[0][0]}`, { state: 'edit' });
  }
  function deleteOne() {
    navigate(`/organization/branch/Edit/${selectedRows[0][0]}`);
  }

  const columns = [
    { title: 'English Name', field: 'nameEn' },
    { title: 'Arabic Name', field: 'nameAr' }
  ];

  const onRowClick = (e, rowData) => {
    navigate(`/organization/branch/${rowData.id}`, { state: 'view' });
  };

  const editInPage = (e, rowData) => {
    navigate(`/organization/branch/edit/${rowData.id}`, { state: 'edit' });
  };

  const deleteInRow = (oldData) =>
    new Promise(async (resolve, reject) => {
      setTimeout(() => {
        console.log(oldData);
        Delete(oldData.id)
          .then((resu) => {
            GetAll().then((res) => {
              setTableData(res.data.results);
              showToast('Deleted Successfully', 2000, 'success');
            });
          })
          .catch((error) => {
            // showToast(error.response.data.Message, 2000, "error");
          });
        resolve();
      }, 10);
    });

  const EditInRow = (newData, oldData) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log(newData);
        GetById(newData.id).then((res) => {
          console.log({ ...res.data, nameAr: newData.nameAr, nameEn: newData.nameEn });
          Update({
            payload: { ...res.data, nameAr: newData.nameAr, nameEn: newData.nameEn },
            id: newData.id
          })
            .then(() => {
              GetAll().then((res) => {
                setTableData(res.data.results);
                showToast('Edited Successfully', 2000, 'success');
              });
            })
            .catch((error) => {
              // showToast(error.response.data.Message, 2000, "error");
              console.log(error);
            });
        });
        resolve();
      }, 0);
    });
  // action for row like edit delete view
  const handleActionsRow = (action, row) => {
    switch (action) {
      case actions.view:
        {
          navigate(`/organization/branch/${row['id']}`, { state: 'view' });
        }
        break;
      case actions.edit:
        {
          navigate(`/organization/branch/Edit/${row['id']}`, { state: 'edit' });
        }
        break;
      case actions.del: {
        if (!confirm(`Are you sure you want to delete ${row.getValue('firstName')}`)) {
          return;
        }
        //TODO
        //send api delete request here, then refetch or update local table data for re-render

        deleteRowQuery.mutate(row['id']);
        // Assuming tableData is a state variable
        const updatedTableData = [...tableData];
        updatedTableData.splice(row.index, 1);
        setTableData(updatedTableData);
        break;
      }

      default:
        console.log(action);
        break;
    }
  };

  function handleSaveRowEdits() {
    console.log('hello');
  }

  const handleSaveRow = async ({ exitEditingMode, row, values }) => {
    const merge = (...objects) => objects.reduce((acc, cur) => ({ ...acc, ...cur }));
    tableData[row.index] = merge(tableData[row.index], values);
    saveRowQuery.mutate({ payload: values, rowId: row['id'] });
    setTableData([...tableData]);
    exitEditingMode();
  };

  useEffect(() => {
    const len = Object.values(rowSelection).filter((item) => item).length;
    setIsEditDisable(len != 1);
    setIsDeleteDisable(len < 1);
  }, [rowSelection]);
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
                <PageTitle text="Branches" />
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
                      actions: ['New'],
                      handler: addNew
                    }}
                    iconName="addCircle"
                    buttonColor={''}
                    hoverText={'Add New Branche'}
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
            <ValueTable
              col={columns}
              data={tableData}
              handleRowClick={onRowClick}
              editInPage={editInPage}
              handleDelete={deleteInRow}
              handleEdit={EditInRow}
              pageSize={10}
            />
          </Box>
        )
      )}
    </Box>
  );
};
