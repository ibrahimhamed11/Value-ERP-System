import {
  Button,
  Grid,
  styled,
  Box,
  Typography,
  Autocomplete,
  TextField,
  Modal,
  Tabs,
  Tab,
  IconButton
} from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { DeleteRoleByid, GetById, Update, addRule, getAllRule } from '../api/rules';
import PathBreadcrumbs from '../../../../components/FormsUI/PathBreadcrumbs';
import { Formik, Form, useFormikContext, Field, useField } from 'formik';
import Textfield from '../../../../components/FormsUI/Textfield';
import { AddCircle } from '@mui/icons-material';
import { Section } from '../../../../components/FormsUI/Section';
import * as Yup from 'yup';
import { Close as CloseIcon, AddBox as AddBoxIcon } from '@mui/icons-material';
import { useMemo, useRef, useState, useEffect } from 'react';
import CheckboxWrapper from '../../../../components/FormsUI/Checkbox';
import ComboBox from '../../../../components/FormsUI/Auto Complete/AutoComplete';
import DropdownButton from '../../../../components/DropdownButton/DropDownButton';
import MaterialReactTable from 'material-react-table';
import PageTitle from '../../../../components/pageTitle/PageTitle';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import LoadingWrapper from '../../../../components/Loading';
import ErrorWrapper from '../../../../components/Error';
import ErrorMessageBox from '../../../../components/errorMsgBox/ErrorMessageBox ';
import { Delete } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import showToast from '../../../../utils/toastMessage';
import Tfield from '../../../../components/ViewUI/Textfield';
import ValueTable from '../../../../components/ValueTable/ValueTable';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 600,
  bgcolor: (theme) => (theme.palette.mode == 'dark' ? '#1E1E1E' : 'background.paper'),
  borderRaduis: '8px',
  boxShadow: 24,
  padding: '0 0 12px'
};

export const Role = () => {
  const navigate = useNavigate();
  const { id: roleId } = useParams();
  const { state: mode } = useLocation();
  const [value, setValue] = useState(1);
  const [data, setData] = useState([]);
  const [openModel, setOpenModel] = useState(false);
  const [navigationRoute, setNavigationRoute] = useState();
  const [errorMessage, setErrorMessage] = useState('');
  const [nextDisabled, setNextDisabled] = useState(true);
  const [prevDisabled, setPrevDisabled] = useState(true);
  const [firstDisabled, setFirstDisabled] = useState(true);
  const [lastDisabled, setLastDisabled] = useState(true);
  const [allRole, setAllRole] = useState([]);
  const [id, setId] = useState(roleId);
  const [initialValues, setInitialValues] = useState({
    roleName: '',
    objectType: ''
  });

  useEffect(() => {
    getAllRule().then((res) => {
      setAllRole(res.data.results);
      if (res.data.results[0].id == roleId) {
        setPrevDisabled(false);
        setFirstDisabled(false);
      } else if (res.data.results[res.data.results.length - 1].id === roleId) {
        setNextDisabled(false);
        setLastDisabled(false);
      }
    });
  }, []);

  const hideError = () => {
    setErrorMessage('');
  };

  function CloseModel() {
    setOpenModel(false);
  }
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const submitFormBTN = useRef(null);

  const {
    isLoading,
    error,
    data: result
  } = useQuery({
    queryKey: ['Role', roleId],
    queryFn: async () => {
      const data = await GetById(roleId);
      return data;
    },
    onSuccess: (result) => {
      let arr = [];
      let obj = {};
      for (let val of result.data.permissions) {
        obj = { name: val.objectType };
        for (let x of val.permissions) {
          if (x.nameEn === 'Create') {
            obj = { ...obj, Create: 'Allow' };
          }
          if (x.nameEn === 'Read') {
            obj = { ...obj, Read: 'Allow' };
          }
          if (x.nameEn === 'Delete') {
            obj = { ...obj, Delete: 'Allow' };
          }
          if (x.nameEn === 'Write') {
            obj = { ...obj, Write: 'Allow' };
          }
        }
        if (!('Create' in obj)) {
          obj = { ...obj, Create: 'Deny' };
        }
        if (!('Read' in obj)) {
          obj = { ...obj, Read: 'Deny' };
        }
        if (!('Create' in obj)) {
          obj = { ...obj, Create: 'Deny' };
        }
        if (!('Delete' in obj)) {
          obj = { ...obj, Delete: 'Deny' };
        }

        arr.push(obj);
      }
      console.log("first", arr)
      setData([...arr]);
      setInitialValues({
        ...initialValues,
        roleName: result.data.roleName
      });
    }
  });

  const pages = [
    'Company',
    'CompanyBranch',
    'Journal',
    'CostCenter',
    'Role',
    'User',
    'CostCenterCategory',
    'Permission',
    'GLAccount'
  ];

  const options = {
    actions: ['Save', 'Save & close', 'Save & new'],
    handler: handleSave
  };
  function handleSave(action) {
    submitFormBTN.current.click();
    setNavigationRoute(action === options.actions[1] ? 1 : action === options.actions[2] ? 2 : 0);
  }

  function addData(da) {
    let inn = pages.findIndex((item) => item == da.objectType);
    let obj = {
      name: da.objectType,
      Read: da.Read ? 'Allow' : 'Deny',
      Create: da.Create ? 'Allow' : 'Deny',
      Write: da.Write ? 'Allow' : 'Deny',
      Delete: da.Delete ? 'Allow' : 'Deny'
    };
    setData([...data, obj]);
    CloseModel();
  }
  const columnRole = [
    {
      title: 'Name of Role', field: 'name', editComponent: props => (
        <ComboBox
          value={props.value}
          options={pages}
          name="pages"
          onChange={(e, value) => {
            props.onChange(value);
          }}
          label="pages"
        />
      )
    },
    {
      title: 'Read',
      field: 'Read',
      lookup: { 'Allow': 'Allow', 'Deny': 'Deny' },
    }, {
      title: 'Create',
      field: 'Create',
      lookup: { 'Allow': 'Allow', 'Deny': 'Deny' },
    }, {
      title: 'Write',
      field: 'Write',
      lookup: { 'Allow': 'Allow', 'Deny': 'Deny' },
    }, {
      title: 'Delete',
      field: 'Delete',
      lookup: { 'Allow': 'Allow', 'Deny': 'Deny' },
    },]
  const onRowAdd = newData =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        setData([...data, newData]);

        resolve();
      }, 1000)
    });
  const onRowUpdate = (newData, oldData) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        const dataUpdate = [...data];
        const index = oldData.tableData.id;
        dataUpdate[index] = newData;
        setData([...dataUpdate]);

        resolve();
      }, 1000);
    })
  const onRowDelete = oldData =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        const dataDelete = [...data];
        const index = oldData.tableData.id;
        dataDelete.splice(index, 1);
        setData([...dataDelete]);

        resolve();
      }, 1000);
    })

  const columnUser = useMemo(
    () => [
      {
        header: 'User',
        accessorKey: 'nameEn',
        enableClickToCopy: true,
        sx: {
          justifyContent: 'flex-start'
        }
      }
    ],
    []
  );

  const SubmitUpdateForm = async (values, roleId) => {
    const permissions = [];
    for (const item of data) {
      const permissionNames = [];
      // Check if permission is allowed and add it to permissionNames array
      if (item.Read === 'Allow') {
        permissionNames.push('Read');
      }
      if (item.Create === 'Allow') {
        permissionNames.push('Create');
      }
      if (item.Write === 'Allow') {
        permissionNames.push('Write');
      }
      if (item.Delete === 'Allow') {
        permissionNames.push('Delete');
      }
      // If any permissions are allowed, add them to permissions array
      if (permissionNames.length > 0) {
        permissions.push({
          objectType: item.name,
          permissionNames
        });
      }
    }

    const updatedData = {
      name: values.roleName,
      permissions
    };
    if (mode === 'edit') {
      try {

        // Call the Update function with updated data and roleId
        const response = await Update({ data: updatedData, id: roleId });
        const statusCode = response.status;
        if (statusCode === 200) {
          showToast('Successfully Updated!', 2000, 'success');
          setTimeout(() => {
            if (navigationRoute === 0) {
              navigate(`/administration/role/edit/${roleId}`, { state: "edit" });
            } else if (navigationRoute === 1) {
              navigate(`/administration/role`);
            } else if (navigationRoute === 2) {
              navigate(`/administration/role/add`);
            }
          }, 2000);
        } else if (statusCode === 400) {
          setErrorMessage('Please provide valid data!');
          showToast('Please provide valid data!', 2000, 'error');
        }
      } catch (error) {
        setErrorMessage('An error occurred. Please try again later.');
        showToast('An error occurred. Please try again later.', 2000, 'error');
        console.error(error);
      }
    } else if (mode === 'add') {
      addRule(updatedData)
        .then((res) => {
          setTimeout(() => {
            if (navigationRoute === 0) {
              navigate(`/administration/role/edit/${res.data}`, { state: "edit" });
            } else if (navigationRoute === 1) {
              navigate(`/administration/role`);
            } else if (navigationRoute === 2) {
              navigate(`/administration/role/add`);
            }
          }, 2000);
          showToast('Successfully Added!', 2000, 'success');
        })
        .catch((err) => {
          console.log(err);
          showToast('Successfully Added!', 2000, 'error');
        });
    }
  };

  return (
    <>
      {isLoading && mode !== 'add' ? (
        <LoadingWrapper />
      ) : (
        <>
          <Formik
            enableReinitialize
            initialValues={{
              ...initialValues
            }}
            // validationSchema={FORM_VALIDATION}
            onSubmit={(values, actions) => SubmitUpdateForm(values, roleId, actions)}>
            {({ values, handleSubmit, setFieldValue, resetForm, dirty }) => (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#000' : '#153d77')
                }}>
                <ToastContainer />
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginX: '20px',
                    alignItems: 'center',
                    mb: '15px'
                  }}>
                  <PageTitle
                    text={mode === 'add' ? 'Add Role' : mode === 'edit' ? 'Edit Role' : 'View Role'}
                  />
                  <Box sx={{ marginY: 0, marginX: '20px', display: 'flex' }}>
                    {mode !== 'edit' ? (
                      <DropdownButton
                        disabled={mode !== 'view'}
                        options={{
                          actions: ['Edit'],
                          handler: function () {
                            navigate(`/administration/role/edit/${roleId}`, { state: 'edit' });
                          }
                        }}
                        iconName=""
                        buttonColor={''}
                        hoverText={'Edit Role'}
                      />
                    ) : (
                      <DropdownButton
                        disabled={mode !== 'edit'}
                        options={{
                          actions: ['View'],
                          handler: function () {
                            navigate(`/administration/role/${roleId}`, { state: 'view' });
                          }
                        }}
                        iconName=""
                        buttonColor={''}
                        hoverText={'View Role'}
                      />
                    )}

                    <DropdownButton
                      disabled={!dirty && mode === 'add'}
                      options={{
                        actions: ['Add'],
                        handler: function () {
                          navigate('/administration/role/add', { state: 'add' });
                        }
                      }}
                      iconName="addCircle"
                      buttonColor={''}
                      hoverText={'Add New Role'}
                    />
                    <DropdownButton
                      disabled={!firstDisabled || mode === 'add'}
                      options={{
                        actions: ['First'],
                        handler: function () {
                          let index = 0;
                          for (let i = 0; i < allRole.length; i++) {
                            if (allRole[i]['id'] == roleId) {
                              index = i;
                            }
                          }
                          if (index == 0) {
                            setFirstDisabled(false);
                          } else {
                            console.log(index);
                            navigate(
                              `/administration/role/${mode === 'edit' ? 'edit/' : ''}${allRole[0].id
                              }`,
                              { state: `${mode}` }
                            );
                          }
                        }
                      }}
                      buttonColor={''}
                      hoverText={'Get First Role'}
                    />
                    {/* Previous Button  */}
                    <DropdownButton
                      // width="20px" //
                      disabled={!prevDisabled || mode === 'add'}
                      options={{
                        actions: [],
                        handler: function () {
                          let index = allRole.findIndex((role) => role.id === id);
                          if (index !== -1) {
                            if (index === 0) {
                              setPrevDisabled(false);
                            } else {
                              navigate(
                                `/administration/role/${mode === 'edit' ? 'edit/' : ''}${allRole[index - 1].id
                                }`,
                                { state: `${mode}` }
                              );
                            }
                          }
                        }
                      }}
                      iconName="ArrowBackIosIcon"
                      buttonColor={''}
                      hoverText={'Get Previos Role'}
                    />
                    {/* Next Button  */}
                    <DropdownButton
                      width="60px" //
                      disabled={!nextDisabled || mode === 'add'}
                      options={{
                        actions: [],
                        handler: function () {
                          let index = 0;
                          for (let i = 0; i < allRole.length; i++) {
                            if (allRole[i]['id'] == id) {
                              index = i;
                            }
                          }
                          if (index == allRole.length - 1) {
                            setNextDisabled(true);
                          } else {
                            navigate(
                              `/administration/role/${mode === 'edit' ? 'edit/' : ''}${allRole[index + 1].id
                              }`,
                              { state: `${mode}` }
                            );
                          }
                        }
                      }}
                      iconName="ArrowForwardIosIcon"
                      buttonColor={''}
                      hoverText={'Get Next Role'}
                    />
                    <DropdownButton
                      disabled={!lastDisabled || mode === 'add'}
                      options={{
                        actions: ['Last'],
                        handler: function () {
                          let index = 0;
                          for (let i = 0; i < allRole.length; i++) {
                            if (allRole[i]['id'] == roleId) {
                              index = i;
                            }
                          }
                          if (index == allRole.length - 1) {
                            setFirstDisabled(false);
                          } else {
                            console.log(index);
                            navigate(
                              `/administration/role/${mode === 'edit' ? 'edit/' : ''}${allRole[allRole.length - 1].id
                              }`,
                              { state: `${mode}` }
                            );
                          }
                        }
                      }}
                      buttonColor={''}
                      hoverText={'Get Last Role'}
                    />
                    <DropdownButton
                      options={{
                        actions: ['Delete'],
                        handler: function () {
                          if (
                            !window.confirm(
                              'Are You Sure You Want To Delete This ' + result?.data['roleName']
                            )
                          ) {
                            return;
                          }
                          DeleteRoleByid(roleId).then((res) => {
                            navigate('/administration/role');
                          });
                        }
                      }}
                      iconName="delete"
                      buttonColor={'red'}
                      disabled={false}
                      hoverText={'Delete Role'}
                    />
                    <DropdownButton
                      buttonName="Save"
                      options={options}
                      icon="save"
                      iconName="save"
                      hoverText={'Save Role Options'}
                    />
                  </Box>
                </Box>
                {mode === 'add' ? (
                  <PathBreadcrumbs
                    crumbs={location.pathname
                      .substring(1)
                      .split('/')
                      .map((string) => string.replace(/-/g, ' '))}
                  />
                ) : (
                  <PathBreadcrumbs
                    crumbs={location.pathname
                      .substring(1)
                      .split('/')
                      .slice(0, -1)
                      .map((string) => string.replace(/-/g, ' '))}
                  />
                )}
                <>
                  <Form>
                    <Section name={'Role'}>
                      <ErrorMessageBox errorMessage={errorMessage} onClose={hideError} />

                      <Grid item xs={12} md={6}>
                        {mode !== 'view' ? (
                          <Textfield name="roleName" label="Name" placeholder="Enter name" />
                        ) : (
                          <Tfield id="name" label="name of role" value={result?.data['roleName']} />
                        )}
                      </Grid>
                    </Section>
                    <Section name={'Role Details'}>
                      <Modal
                        open={openModel}
                        onClose={CloseModel}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description">
                        <Box sx={style}>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              backgroundColor: '#153D77',
                              padding: '5px 20px'
                            }}>
                            <Typography
                              sx={{
                                color: (theme) =>
                                  theme.palette.mode == 'dark' ? 'white' : 'white',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                marginBottom: '10px',
                                marginTop: '10px',
                                fontFamily: 'Roboto'
                              }}
                              variant="h3">
                              Add Role
                            </Typography>
                            <CloseIcon
                              onClick={CloseModel}
                              sx={{ color: 'white', cursor: 'pointer' }}
                            />
                          </Box>
                          <Box sx={{ marginX: '7px', marginY: '20px' }}>
                            <ComboBox
                              options={pages}
                              name="pages"
                              onChange={(e, value) => setFieldValue('objectType', value)}
                              label="pages"
                            />
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'space-around',
                              marginBottom: '20px'
                            }}>
                            <CheckboxWrapper name="Read" label="Read" />
                            <CheckboxWrapper name="Create" label="Create" />
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'space-around',
                              marginBottom: '20px'
                            }}>
                            <CheckboxWrapper name="Write" label="Write" />
                            <CheckboxWrapper name="Delete" label="Delete" />
                          </Box>

                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center'
                            }}>
                            <DropdownButton
                              options={{
                                actions: ['Add'],
                                handler: function () {
                                  addData(values);
                                  values.Read = false;
                                  values.Write = false;
                                  values.Create = false;
                                  values.Delete = false;
                                }
                              }}
                              iconName=""
                              buttonColor={''}
                              hoverText={'Add New Role'}
                            />
                          </Box>
                        </Box>
                      </Modal>
                      <Box
                        sx={{
                          borderBottom: 1,
                          borderColor: 'divider',
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                          <Tab label="Permissions" value={1} />
                          {/* <Tab label="Users" value={2} /> */}
                        </Tabs>
                        {mode !== 'view' && (
                          <Box sx={{ marginBottom: '30px' }}>
                            {/* Other components inside the box */}
                            <DropdownButton
                              options={{
                                actions: ['New'],
                                handler: function () {
                                  setOpenModel(true);
                                }
                              }}
                              iconName=""
                              buttonColor={''}
                              hoverText={'Add New Role For Page'}
                            />
                          </Box>
                        )}
                      </Box>

                      <Box sx={{ width: '100%' }}>
                        <Box sx={{ width: '100%' }}>

                          <ValueTable
                            edit={false}
                            handleDelete={onRowDelete}
                            handleEdit={onRowUpdate}
                            handleAdd={onRowAdd}
                            col={columnRole}
                            data={data}
                          />
                        </Box>
                      </Box>
                    </Section>
                    <Button ref={submitFormBTN} sx={{ display: 'none' }} type="submit" />
                  </Form>
                </>
              </Box>
            )}
          </Formik>
        </>
      )}
    </>
  );
};
