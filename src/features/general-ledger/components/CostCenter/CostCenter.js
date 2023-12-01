import React, { useRef, useState, useEffect } from 'react';
import { Button, Grid, Box, Typography } from '@mui/material';
import Textfield from '../../../../components/FormsUI/Textfield';
import PathBreadcrumbs from '../../../../components/FormsUI/PathBreadcrumbs';
import * as Yup from 'yup';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DropdownButton from '../../../../components/DropdownButton/DropDownButton';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  addCostCenter,
  getAllCategory,
  getAll,
  GetById,
  getAllLookup,
  GetCostCenterCategoryById,
  Update,
  DeleteCostCenter
} from '../../api/costCenter';
import { Formik, Form } from 'formik';
import { Section } from '../../../../components/FormsUI/Section';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomSwitch from '../../../../components/FormsUI/switch/switch';
import showToast from '../../../../utils/toastMessage';
import { useMemo } from 'react';
import PageTitle from '../../../../components/pageTitle/PageTitle';
import ErrorMessageBox from '../../../../components/errorMsgBox/ErrorMessageBox ';
import CustomAutocomplete from '../../../../components/customAutoComplete/CustomAutoComplete';
import Tfield from '../../../../components/ViewUI/Textfield';
import LoadingWrapper from '../../../../components/Loading';
import ValueTable from '../../../../components/ValueTable/ValueTable';
// import CostCenterModal from './CostCenterModal';
import AntModal from './AntModal';

export const CostCenter = () => {
  const navigate = useNavigate();
  const submitFormBTN = useRef(null);
  const { state: mode } = useLocation();
  const [categories, setCategories] = useState([]);
  const [costcenters, setcostcenters] = useState([]);
  const [tableCostCenters, setTableCostCenters] = useState([]);
  const [costCenterCategoryName, setCostcenterCategoryName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { id: costcenterId } = useParams();
  const [parentName, setParentName] = useState('');
  const [nextDisabled, setNextDisabled] = useState(true);
  const [prevDisabled, setPrevDisabled] = useState(true);
  const [firstDisabled, setFirstDisabled] = useState(true);
  const [lastDisabled, setLastDisabled] = useState(true);
  const [rerenderAutocomplete, setRerenderAutocomplete] = useState(false);
  const [NavigationRoute, setNavigationRoute] = useState(() => null);
  const [costCenterLookUp, setCostCenterLookUp] = useState([]);
  const [initialValues, setInitialValues] = useState({
    costCenterNo: '',
    nameAr: '',
    nameEn: '',
    isActive: true,
    costCenterCategoryId: '',
    parentCostCenterId: null
  });

  const deleteInRow = (oldData) =>
    new Promise(async (resolve, reject) => {
      setTimeout(() => {
        const rowId = oldData.id;
        console.log(rowId);
        console.log(tableCostCenters);
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
        GetById(newData.costCenterNo.id).then((res) => {
          setTableCostCenters([...tableCostCenters, res.data]);
          handleClose();
        });

        resolve();
      }, 10);
    });

  const EditInRow = async (newData, oldData) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        GetById(newData.costCenterNo.id).then((res) => {
          setTableCostCenters([...tableCostCenters, res.data]);
          setTableCostCenters((costs) => costs.filter((cost) => cost.id !== newData.id));
          handleClose();
        });
        resolve();
      }, 0);
    });

  const AddCostCentertQuery = useMutation({
    mutationFn: addCostCenter,
    onSuccess: (result) => {}
  });

  useEffect(() => {
    getAllCategory().then((data) => setCategories(data));
    getAll().then((data) => {
      setcostcenters(data);
      if (data[0].item.id == costcenterId) {
        setPrevDisabled(false);
        setFirstDisabled(false);
      } else if (data[data.length - 1].item.id === costcenterId) {
        setNextDisabled(false);
        setLastDisabled(false);
      }
    });
    getAllLookup().then((res) => {
      setCostCenterLookUp(res);
    });
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryData = await getAllCategory();
        setCategories(categoryData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, [NavigationRoute, rerenderAutocomplete]);

  useEffect(() => {
    if (true) {
      window.onbeforeunload = function () {
        return true;
      };
    }

    return () => {
      window.onbeforeunload = null;
    };
  }, [true]);

  const {
    isLoading,
    error,
    data: result
  } = useQuery({
    queryKey: ['costcenterId', costcenterId],
    queryFn: async () => {
      const data = await GetById(costcenterId);
      return data;
    },
    onSuccess: (result) => {
      console.log(result);
      if (mode !== 'add') {
        GetCostCenterCategoryById(result.data.costCenterCategoryId).then((res) => {
          setCostcenterCategoryName(res.data.nameEn);
        });
        if (result.data.parentCostCenterId) {
          GetById(result.data.parentCostCenterId).then((res) => {
            setParentName(res.data.nameEn);
          });
        }
        setTableCostCenters(result['data']['childCenters'] || []);
        setInitialValues({
          ...initialValues,
          nameAr: result['data']['nameAr'],
          nameEn: result['data']['nameEn'],
          costCenterNo: result['data']['costCenterNo'],
          isActive: result['data']['isActive'],
          costCenterCategoryId: result['data']['costCenterCategoryId'],
          parentCostCenterId: result['data']['parentCostCenterId']
        });
      }
    }
  });

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = (x) => {
    setOpen(false);
    if (x) {
      setTableCostCenters([...tableCostCenters, x]);
    }
  };

  //colums
  const columnss = useMemo(
    () => [
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

  //Form Validations
  const FORM_VALIDATION = Yup.object().shape({
    nameAr: Yup.string().required('Required'),
    nameEn: Yup.string().required('Required')
    // costCenterCategoryId: Yup.string().required('Required')
  });

  const hideError = () => {
    setErrorMessage('');
  };

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
      try {
        // values.isActive = isActiv

        const result = await AddCostCentertQuery.mutateAsync(values);

        if (result.status === 200) {
          showToast('Successfully Added!!', 2000, 'success');

          setTimeout(() => {
            if (NavigationRoute === 1) {
              navigate(`/general-ledger/master-files/costcenter`);
            } else if (NavigationRoute === 2) {
              navigate(`/general-ledger/master-files/costcenter/add`,{state:"add"});
            } else if (NavigationRoute === 0) {
              navigate(`/general-ledger/master-files/costcenter/edit/${result.data}`, {
                state: 'edit'
              });
            }
          }, 2000);
        } else if (result.status === 400) {
          showToast('Please provide valid data!', 2000, 'error');
          setErrorMessage('Please provide valid data!');
        }
      } catch (error) {
        console.error('Error adding row:', error);
        const err = Object.keys(error.response.data.errors)[0];

        // Show an error toast
        const errorMessage =
          error.response?.data?.Message || `${error.response.data.errors[`${err}`]}`;
        showToast(errorMessage, 2000, 'error');
      }
    }
    if (mode === 'edit') {
      console.log(values);
      Update({
        data: values,
        costCenterId: costcenterId
      })
        .then((response) => {
          setErrorMessage('');
          const statusCode = response.status;

          if (statusCode === 200) {
            showToast('Successfully Updated!', 2000, 'success');

            setTimeout(() => {
              if (NavigationRoute === 1) {
                navigate(`/general-ledger/master-files/costcenter`);
              } else if (NavigationRoute === 2) {
                navigate(`/general-ledger/master-files/costcenter`);
              }
            }, 2000);
          } else if (statusCode === 400) {
            setErrorMessage('Please provide valid data!');
            showToast('Please provide valid data!', 2000, 'error');
          }
        })
        .catch((error) => {
          console.log(error)

        // Show an error toast
        const errorMessage =
          error.response?.data?.Message;
        showToast(errorMessage, 2000, 'error');
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
            validationSchema={FORM_VALIDATION}
            onSubmit={(values, actions) => SubmitAddForm(values, actions)}>
            {({ values, handleSubmit, setFieldValue, resetForm, errors, touched, dirty }) => (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#000' : '#153d77')
                }}>
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
                        ? 'Add Cost Center'
                        : mode === 'edit'
                        ? 'Edit Cost Center'
                        : 'View Cost Center'
                    }
                  />

                  {/* Buttons */}
                  <Box sx={{ marginY: 0, marginX: '20px', display: 'flex' }}>
                    {mode !== 'edit' ? (
                      <DropdownButton
                        disabled={mode !== 'view'}
                        options={{
                          actions: ['Edit'],
                          handler: function () {
                            navigate(
                              `/general-ledger/master-files/costcenter/edit/${costcenterId}`,
                              {
                                state: 'edit'
                              }
                            );
                          }
                        }}
                        iconName=""
                        buttonColor={''}
                        hoverText={'View CostCenter'}
                      />
                    ) : (
                      <DropdownButton
                        disabled={mode !== 'edit'}
                        options={{
                          actions: ['View'],
                          handler: function () {
                            navigate(
                              `/general-ledger/master-files/costcenter/edit/${costcenterId}`,
                              {
                                state: 'view'
                              }
                            );
                          }
                        }}
                        iconName=""
                        buttonColor={''}
                        hoverText={'Edit CostCenter'}
                      />
                    )}

                    <DropdownButton
                      disabled={!dirty && mode === 'add'}
                      options={{
                        actions: ['New'],
                        handler: function () {
                          navigate('/general-ledger/master-files/costcenter/add', { state: 'add' });
                        }
                      }}
                      iconName="addCircle"
                      buttonColor={''}
                      hoverText={'Add CostCenter'}
                    />
                    <DropdownButton
                      disabled={!firstDisabled || mode === 'add'}
                      options={{
                        actions: ['First'],
                        handler: function () {
                          let index = 0;

                          for (let i = 0; i < costcenters.length; i++) {
                            if (costcenters[i]['item']['id'] == costcenterId) {
                              index = i;
                            }
                          }
                          if (index == 0) {
                            setFirstDisabled(false);
                          } else {
                            navigate(
                              `/general-ledger/master-files/costcenter/${
                                mode === 'edit' ? 'edit/' : ''
                              }${costcenters[0]['item'].id}`,
                              { state: `${mode}` }
                            );
                          }
                        }
                      }}
                      buttonColor={''}
                      hoverText={'Get First CostCenter'}
                    />

                    <DropdownButton
                      disabled={!prevDisabled || mode === 'add'}
                      options={{
                        actions: [],
                        handler: function () {
                          let index = 0;
                          for (let i = 0; i < costcenters.length; i++) {
                            if (costcenters[i]['item']['id'] == costcenterId) {
                              index = i;
                            }
                          }
                          if (index == 0) {
                            setPrevDisabled(false);
                          } else {
                            navigate(
                              `/general-ledger/master-files/costcenter/${
                                mode === 'edit' ? 'edit/' : ''
                              }${costcenters[index - 1]['item'].id}`,
                              { state: `${mode}` }
                            );
                          }
                        }
                      }}
                      iconName="ArrowBackIosIcon"
                      buttonColor={''}
                      hoverText={'Get Previos CostCenter'}
                    />
                    <DropdownButton
                      disabled={!nextDisabled || mode === 'add'}
                      options={{
                        actions: [],
                        handler: function () {
                          let index = 0;
                          for (let i = 0; i < costcenters.length; i++) {
                            if (costcenters[i]['item']['id'] == costcenterId) {
                              index = i;
                            }
                          }
                          if (index == costcenters.length - 1) {
                            setNextDisabled(true);
                          } else {
                            navigate(
                              `/general-ledger/master-files/costcenter/${
                                mode === 'edit' ? 'edit/' : ''
                              }${costcenters[index + 1]['item'].id}`,
                              { state: `${mode}` }
                            );
                          }
                        }
                      }}
                      iconName="ArrowForwardIosIcon"
                      buttonColor={''}
                      hoverText={'Get Second CostCenter'}
                    />
                    <DropdownButton
                      disabled={!lastDisabled || mode === 'add'}
                      options={{
                        actions: ['Last'],
                        handler: function () {
                          let index = 0;
                          for (let i = 0; i < costcenters.length; i++) {
                            if (costcenters[i]['item']['id'] == costcenterId) {
                              index = i;
                            }
                          }
                          if (index == costcenters.length - 1) {
                            setFirstDisabled(false);
                          } else {
                            navigate(
                              `/general-ledger/master-files/costcenter/${
                                mode === 'edit' ? 'edit/' : ''
                              }${costcenters[costcenters.length - 1]['item'].id}`,
                              { state: `${mode}` }
                            );
                          }
                        }
                      }}
                      buttonColor={''}
                      hoverText={'Get Last CostCenter'}
                    />

                    <DropdownButton
                      options={{
                        actions: ['Delete'],
                        handler: function () {
                          if (
                            !window.confirm(
                              `Are You Sure You Want To Delete This ${result?.data['nameEn']}`
                            )
                          ) {
                            return;
                          }
                          DeleteCostCenter(costcenterId).then((res) => {
                            navigate('/general-ledger/master-files/costcenter');
                          });
                        }
                      }}
                      iconName="delete"
                      buttonColor={'red'}
                      disabled={mode === 'add'}
                      hoverText={'Delete CostCenter'}
                    />

                    <DropdownButton
                      buttonName="Save"
                      options={options}
                      icon="save"
                      iconName="save"
                      hoverText={'Save CostCenter Options'}
                    />
                  </Box>
                </Box>

                {/* path name */}
                <Box
                  sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Grid
                    container
                    alignItems="center"
                    justifyContent="space-between"
                    width="100%"
                    sx={{ marginRight: '20px' }}>
                    <Box>
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
                    </Box>
                  </Grid>
                </Box>

                <Form>
                  <Section name={'Cost Centers'}>
                    <ErrorMessageBox errorMessage={errorMessage} onClose={hideError} />
                    <Grid item xs={12} md={4}>
                      {mode !== 'view' ? (
                        <Textfield name="costCenterNo" label="ID" placeholder="Enter ID" />
                      ) : (
                        <Tfield
                          name="costCenterNo"
                          label="ID"
                          value={result?.data['costCenterNo']}
                        />
                      )}
                    </Grid>
                    <Grid item xs={12} md={4}>
                      {mode !== 'view' ? (
                        <Textfield
                          name="nameAr"
                          label="Arabic Name"
                          placeholder="Enter Arabic name"
                        />
                      ) : (
                        <Tfield id="nameAr" label="Arabic Name" value={result?.data['nameAr']} />
                      )}
                    </Grid>
                    <Grid item xs={12} md={4}>
                      {mode !== 'view' ? (
                        <Textfield
                          name="nameEn"
                          label="English Name"
                          placeholder="Enter English name"
                        />
                      ) : (
                        <Tfield id="nameEn" label="English Name" value={result?.data['nameEn']} />
                      )}
                    </Grid>

                    <Grid item xs={12} md={4}>
                      {mode !== 'view' ? (
                        <CustomAutocomplete
                          data={categories}
                          columns={columnss}
                          value={values?.costCenterCategoryId}
                          show="nameEn"
                          label="Cost Center Categories"
                          onChange={(e) => {
                            setFieldValue('costCenterCategoryId', e.id);
                          }}
                        />
                      ) : (
                        <Tfield
                          name="costCenterCategoryId"
                          label="Cost Center Category"
                          value={costCenterCategoryName}
                        />
                      )}

                      <ToastContainer />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      {mode !== 'view' ? (
                        <CustomAutocomplete
                          data={costCenterLookUp}
                          columns={costCentersLookUp}
                          value={values?.parentCostCenterId}
                          show="nameEn"
                          label="Parent"
                          onChange={(e) => {
                            setFieldValue('parentCostCenterId', e.id);
                          }}
                        />
                      ) : (
                        <Tfield name="parentCostCenterId" label="Parent" value={parentName} />
                      )}
                    </Grid>

                    <Grid item xs={4}>
                      <CustomSwitch
                        onChange={(newValue) => setFieldValue('isActive', !newValue)}
                        labelOn="InActive"
                        labelOff="InActive"
                        label="Is Active"
                        isEnabled={mode !== 'add' && !result?.data?.isActive}
                        disabled={mode === 'view'}
                      />
                    </Grid>
                  </Section>
                  <Button ref={submitFormBTN} sx={{ display: 'none' }} type="submit" />
                </Form>
                <AntModal open={open} handleClose={(x) => handleClose(x)} />
              </Box>
            )}
          </Formik>
          <Section name={'Child Cost Centers'}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                width: '100%',
                alignItems: 'center'
              }}>
              {mode !== 'view' && (
                <Button
                  onClick={handleOpen}
                  size="large"
                  sx={{
                    width: '86px',
                    height: '40px',
                    padding: '0',
                    margin: '0 0 30px'
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
