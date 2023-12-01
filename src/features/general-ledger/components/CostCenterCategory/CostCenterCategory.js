import React, { useRef, useState, useEffect } from 'react';
import { Button, Grid, Box, Typography } from '@mui/material';
import Textfield from '../../../../components/FormsUI/Textfield';
import PathBreadcrumbs from '../../../../components/FormsUI/PathBreadcrumbs';
import ComboBox from '../../../../components/FormsUI/Auto Complete/AutoComplete';
import Tfield from '../../../../components/ViewUI/Textfield';
import * as Yup from 'yup';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DropdownButton from '../../../../components/DropdownButton/DropDownButton';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  GetById,
  Update,
  DeleteCostCenterCategory,
  getAll as getAllCategories
} from '../../api/CostCenterCategory';
import { getAll, GetById as getCostCenterById, getAllLookup } from '../../api/costCenter';
import { add } from '../../api/CostCenterCategory';
import { Formik, Form, useFormikContext } from 'formik';
import { Section } from '../../../../components/FormsUI/Section';
import CloseIcon from '@mui/icons-material/Close';
import { MaterialReactTable } from 'material-react-table';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomSwitch from '../../../../components/FormsUI/switch/switch';
import AddBox from '@mui/icons-material/AddBox';
import showToast from '../../../../utils/toastMessage';
import { useMemo } from 'react';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import PageTitle from '../../../../components/pageTitle/PageTitle';
import ErrorMessageBox from '../../../../components/errorMsgBox/ErrorMessageBox ';
import CustomAutocomplete from '../../../../components/customAutoComplete/CustomAutoComplete';
import LoadingWrapper from '../../../../components/Loading';
import ValueTable from '../../../../components/ValueTable/ValueTable';
import AntModal from '../CostCenter/AntModal';

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

export const CostCenterCategoty = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const submitFormBTN = useRef(null);
  const { id: costcenterCategoryId } = useParams();
  const { state: mode } = useLocation();
  const [costcenters, setcostcenters] = useState([]);
  const [tableCostCenters, setTableCostCenters] = useState([]);
  const [modalCostCenter, setModalCostCenter] = useState('');
  const [NavigationRoute, setNavigationRoute] = useState();
  const [costCenterLookUp, setCostCenterLookUp] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [nextDisabled, setNextDisabled] = useState(true);
  const [prevDisabled, setPrevDisabled] = useState(true);
  const [firstDisabled, setFirstDisabled] = useState(true);
  const [lastDisabled, setLastDisabled] = useState(true);
  const [open, setOpen] = React.useState(false);
  const handleOpen = (index) => setOpen(true);
  const handleClose = (x) => {setOpen(false)
  if(x){
    setTableCostCenters([...tableCostCenters,x])
  }
  };
  const [initialValues, setInitialValues] = useState({
    nameAr: '',
    nameEn: '',
    isActive: false
  });

  useEffect(() => {
    getAllLookup().then((res) => {
      setCostCenterLookUp(res);
    });
    getAllCategories().then((res) => {
      setAllCategories(res);
      if (res[0].id == costcenterCategoryId) {
        setPrevDisabled(false);
        setFirstDisabled(false);
      } else if (res[res.length - 1].id === costcenterCategoryId) {
        setNextDisabled(false);
        setLastDisabled(false);
      }
    });
  }, []);

  const columns = [
    {
      title: 'Id',
      field: 'costCenterNo',
      cellStyle: {
        minWidth: 400,
        maxWidth: 400
      },
      editComponent: ({ value, onChange }) => (
        <CustomAutocomplete
          data={costCenterLookUp}
          columns={costCentersLookUp}
          show="costCenterNo"
          label="Cost Center"
          onChange={(e) => onChange(e)}
        />
      )
    },
    { title: 'Name(Arabic)', field: 'nameAr', editable: false },
    { title: 'Name(English)', field: 'nameEn', editable: false },
    { title: 'Is Active', field: 'isActive', editable: false }
  ];
  const costCentersLookUp = useMemo(
    () => [
      {
        header: 'ID',
        accessorKey: 'costCenterNo'
      },
      {
        header: 'Name(Arabic)',
        accessorKey: 'nameAr',

        sx: {
          justifyContent: 'flex-start'
        }
      },
      {
        header: 'Name(English)',
        accessorKey: 'nameEn'
      }
    ],
    []
  );

  const deleteInRow = (oldData) =>
    new Promise(async (resolve, reject) => {
      setTimeout(() => {
        const rowId = oldData.id;
        setTableCostCenters((costs) => costs.filter((cost) => cost.id !== rowId));
        resolve();
      }, 10);
    });

  const onRowClick = (e, rowData) => {
    navigate(`/general-ledger/master-files/costcenter/${rowData.id}`, { state: 'view' });
  };
  

  const AddInRow = (newData) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log(newData.costCenterNo.id);
        getCostCenterById(newData.costCenterNo.id).then((res) => {
          console.log(res);

          setTableCostCenters([...tableCostCenters, res.data]);
          handleClose();
        });

        resolve();
      }, 10);
    });

  const EditInRow = async (newData, oldData) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        getCostCenterById(newData.costCenterNo.id).then((res) => {
          console.log(res);

          setTableCostCenters([...tableCostCenters, res.data]);
          setTableCostCenters((costs) => costs.filter((cost) => cost.id !== newData.id));
          handleClose();
        });
        console.log(newData);
        resolve();
      }, 0);
    });

  const FORM_VALIDATION = Yup.object().shape({
    nameAr: Yup.string().required('Required'),
    nameEn: Yup.string().required('Required')
  });

  const {
    isLoading,
    error,
    data: result
  } = useQuery({
    queryKey: ['costcenterCategoryId', costcenterCategoryId],
    queryFn: async () => {
      const data = await GetById(costcenterCategoryId);
      return data;
    },
    onSuccess: (result) => {
      console.log(result);
      setTableCostCenters(result?.data?.costCenters || []);
      setInitialValues({
        ...initialValues,
        nameAr: result?.data?.nameAr || '',
        nameEn: result?.data?.nameEn || '',
        isActive: result?.data.isActive
      });

      return result;
    }
  });

  const options = {
    actions: ['Save', 'Save & close', 'Save & new'],
    handler: handleSave
  };
  function handleSave(action) {
    submitFormBTN.current.click();
    setNavigationRoute(action === options.actions[1] ? 1 : action === options.actions[2] ? 2 : 0);
  }

  const SubmitAddForm = async (values, actions) => {
    values.costCenters = tableCostCenters;
    console.log(values);
    if (mode === 'add') {
      add(values)
        .then((res) => {
          showToast('Successfully Added!!', 2000, 'success');
          setTimeout(() => {
            if (NavigationRoute === 0) {
              navigate(`/general-ledger/master-files/CostCenterCategory/edit/${res.data}`, {
                state: 'edit'
              });
            } else if (NavigationRoute === 1) {
              navigate(`/general-ledger/master-files/CostCenterCategory`);
            } else if (NavigationRoute === 2) {
              navigate(`/general-ledger/master-files/CostCenterCategory/add`, { state: 'add' });
            }
          }, 2000);
        })
        .catch((error) => {
          // const err = Object.keys(error.response.data.errors)[0]
          showToast(`${error.response.data.Message}`, 2000, 'error');
          // setErrorMessage(error.response.data.errors[`${err}`]);
          setErrorMessage(error.response.data.Message);
          console.log(error);
          setTimeout(() => {
            setErrorMessage('');
          }, 3000);
        });
    } else if (mode === 'edit') {
      Update({ data: values, id: costcenterCategoryId })
        .then((res) => {
          showToast('Successfully Updated!', 2000, 'success');
          setTimeout(() => {
            if (NavigationRoute === 1) {
              navigate(`/general-ledger/master-files/CostCenterCategory`);
            } else if (NavigationRoute === 2) {
              navigate(`/general-ledger/master-files/CostCenterCategory/add`, { state: 'add' });
            }
          }, 2000);
        })
        .catch((error) => {
          if(error?.response.data.errors){
            const err = Object.keys(error?.response.data.errors)[0];
          }

        // Show an error toast
        const errorMessage =
          error.response?.data?.Message || `${error.response.data.errors[`${err}`]}`;
        showToast(errorMessage, 2000, 'error');
          setErrorMessage(errorMessage);
          setTimeout(() => {
            setErrorMessage('');
          }, 3000);
        });
    }
  };

  const hideError = () => {
    setErrorMessage('');
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
            validationSchema={FORM_VALIDATION}
            onSubmit={(values, actions) => SubmitAddForm(values, actions)}>
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
                    text={
                      mode === 'add'
                        ? 'Add Cost Center Category'
                        : mode === 'edit'
                        ? 'Edit Cost Center Category'
                        : 'View Cost Center Category'
                    }
                  />
                  <Box sx={{ marginY: 0, marginX: '20px', display: 'flex' }}>
                    {mode !== 'edit' ? (
                      <DropdownButton
                        disabled={mode !== 'view'}
                        options={{
                          actions: ['Edit'],
                          handler: function () {
                            navigate(
                              `/general-ledger/master-files/CostCenterCategory/edit/${costcenterCategoryId}`,
                              { state: 'edit' }
                            );
                          }
                        }}
                        iconName=""
                        buttonColor={''}
                        hoverText={'Edit Cost Center Category'}

                      />
                    ) : (
                      <DropdownButton
                        disabled={mode !== 'edit'}
                        options={{
                          actions: ['View'],
                          handler: function () {
                            navigate(
                              `/general-ledger/master-files/CostCenterCategory/${costcenterCategoryId}`,
                              { state: 'view' }
                            );
                          }
                        }}
                        iconName=""
                        buttonColor={''}
                        hoverText={'View Cost Center Category'}

                      />
                    )}
                    <DropdownButton
                      disabled={!dirty && mode === 'add'}
                      options={{
                        actions: ['New'],
                        handler: function () {
                          navigate('/general-ledger/master-files/CostCenterCategory/add', {
                            state: 'add'
                          });
                        }
                      }}
                      iconName="addCircle"
                      buttonColor={''}
                      hoverText={'Add Cost Center Category'}

                    />
                    <DropdownButton
                      disabled={!firstDisabled || mode === 'add'}
                      options={{
                        actions: ['First'],
                        handler: function () {
                          let index = 0;

                          for (let i = 0; i < allCategories.length; i++) {
                            if (allCategories[i]['id'] == costcenterCategoryId) {
                              index = i;
                            }
                          }
                          if (index == 0) {
                            setFirstDisabled(false);
                          } else {
                            console.log(index);
                            navigate(
                              `/general-ledger/master-files/CostCenterCategory/${
                                mode === 'edit' ? 'edit/' : ''
                              }${allCategories[0].id}`,
                              { state: `${mode}` }
                            );
                          }
                        }
                      }}
                      buttonColor={''}
                      hoverText={'Get First Cost Center Category'}

                    />
                    <DropdownButton
                      disabled={!prevDisabled || mode === 'add'}
                      options={{
                        actions: [],
                        handler: function () {
                          let index = 0;
                          for (let i = 0; i < allCategories.length; i++) {
                            if (allCategories[i]['id'] == costcenterCategoryId) {
                              index = i;
                            }
                          }
                          if (index == 0) {
                            setPrevDisabled(false);
                          } else {
                            console.log(index);
                            navigate(
                              `/general-ledger/master-files/CostCenterCategory/${
                                mode === 'edit' ? 'edit/' : ''
                              }${allCategories[index - 1].id}`,
                              { state: `${mode}` }
                            );
                          }
                        }
                      }}
                      iconName="ArrowBackIosIcon"
                      buttonColor={''}
                      hoverText={'Get Previos Cost Center Category'}

                    />
                    <DropdownButton
                      disabled={!nextDisabled || mode === 'add'}
                      options={{
                        actions: [],
                        handler: function () {
                          let index = 0;
                          for (let i = 0; i < allCategories.length; i++) {
                            if (allCategories[i]['id'] == costcenterCategoryId) {
                              index = i;
                            }
                          }
                          if (index == allCategories.length - 1) {
                            setNextDisabled(true);
                          } else {
                            console.log(index);
                            navigate(
                              `/general-ledger/master-files/CostCenterCategory/${
                                mode === 'edit' ? 'edit/' : ''
                              }${allCategories[index + 1].id}`,
                              { state: `${mode}` }
                            );
                          }
                        }
                      }}
                      iconName="ArrowForwardIosIcon"
                      buttonColor={''}
                      hoverText={'Get Next Cost Center Category'}

                    />
                    <DropdownButton
                      disabled={!lastDisabled || mode === 'add'}
                      options={{
                        actions: ['Last'],
                        handler: function () {
                          let index = 0;
                          for (let i = 0; i < allCategories.length; i++) {
                            if (allCategories[i]['id'] == costcenterCategoryId) {
                              index = i;
                            }
                          }
                          if (index == allCategories.length - 1) {
                            setFirstDisabled(false);
                          } else {
                            console.log(index);
                            navigate(
                              `/general-ledger/master-files/CostCenterCategory/${
                                mode === 'edit' ? 'edit/' : ''
                              }${allCategories[allCategories.length - 1].id}`,
                              { state: `${mode}` }
                            );
                          }
                        }
                      }}
                      buttonColor={''}
                      hoverText={'Get Last Cost Center Category'}

                    />
                    <DropdownButton
                      options={{
                        actions: ['Delete'],
                        handler: function () {
                          if (
                            !window.confirm(
                              'Are You Sure You Want To Delete This ' + result?.data['nameEn']
                            )
                          ) {
                            return;
                          }
                          DeleteCostCenterCategory(costcenterCategoryId)
                            .then((res) => {
                              showToast(
                                'Cost Center Category Deleted Successfully',
                                2000,
                                'success'
                              );
                              setTimeout(() => {
                                navigate('/general-ledger/master-files/CostCenterCategory');
                              }, 2000);
                            })
                            .catch((error) => {
                              showToast(error.response.data.Message, 2000, 'error');
                              setErrorMessage(error.response.data.Message);
                              setTimeout(() => {
                                setErrorMessage('');
                              }, 3000);
                            });
                        }
                      }}
                      iconName="delete"
                      buttonColor={'red'}
                      disabled={mode === 'add'}
                      hoverText={'Delete Cost Center Category'}

                    />
                    <DropdownButton
                      disabled={mode === 'view'}
                      buttonName="Save"
                      options={options}
                      icon="save"
                      iconName="save"
                      hoverText={'Save Cost Center Category'}

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
                <Form>
                  <Section name={'Cost Centers Category'}>
                    <ErrorMessageBox errorMessage={errorMessage} onClose={hideError} />
                    <Grid item xs={12} md={6}>
                      {mode !== 'view' ? (
                        <Textfield
                          name="nameAr"
                          label="Name(Arabic)"
                          placeholder="Enter Arabic name"
                        />
                      ) : (
                        <Tfield id="nameAr" label="Arabic Name" value={result?.data['nameAr']} />
                      )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      {mode !== 'view' ? (
                        <Textfield
                          name="nameEn"
                          label="Name(English)"
                          placeholder="Enter English name"
                        />
                      ) : (
                        <Tfield id="nameEn" label="English Name" value={result?.data['nameEn']} />
                      )}
                    </Grid>
                    <Grid item xs={6}>
                      <CustomSwitch
                        onChange={(newValue) => setFieldValue('isActive', newValue)}
                        labelOn="Active"
                        labelOff="Active"
                        isEnabled={mode !== 'add' && result?.data?.isActive}
                        disabled={mode === 'view'}
                      />
                    </Grid>
                  </Section>
                  <Button ref={submitFormBTN} sx={{ display: 'none' }} type="submit" />
                </Form>
                
              </Box>
            )}
          </Formik>
          <AntModal open={open} handleClose={(x)=>handleClose(x)} />
          <Section name={'Cost Centers'}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
              {mode !== 'view' && (
                <Button
                  startIcon={<AddBox color="white" />}
                  onClick={handleOpen}
                  size="large"
                  sx={{
                    padding: '11px 32px',
                    marginBottom: '25px'
                  }}
                  color="primary"
                  variant="contained">
                  New
                </Button>
              )}
            </Box>
            <Box sx={{ width: '100%' }}>
              <ValueTable
                col={columns}
                data={tableCostCenters}
                handleDelete={mode !== 'view' ? deleteInRow : ''}
                handleRowClick={onRowClick}
                handleAdd={mode !== 'view' ? AddInRow : ''}
                handleEdit={mode !== 'view' ? EditInRow : ''}
              />
            </Box>
          </Section>
        </>
      )}
    </>
  );
};
