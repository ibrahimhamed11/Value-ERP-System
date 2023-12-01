import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Grid, Box, Typography, TextField } from '@mui/material';
import CustomAutocomplete from '../../../../components/customAutoComplete/CustomAutoComplete';
import Textfield from '../../../../components/FormsUI/Textfield';
import Tfield from '../../../../components/ViewUI/Textfield';
import PathBreadcrumbs from '../../../../components/FormsUI/PathBreadcrumbs';
import * as Yup from 'yup';
import Autocomplete from '@mui/material/Autocomplete';
import showToast from '../../../../utils/toastMessage';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DropdownButton from '../../../../components/DropdownButton/DropDownButton';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Add as AddBranch,
  GetObjectTypes,
  getAllCompaniesLookup,
  Update,
  GetById,
  Delete,
  GetAll
} from '../../api/Branch';
import { Formik, Form } from 'formik';
import { Section } from '../../../../components/FormsUI/Section';
import { useSelector } from 'react-redux';
import CustomSwitch from '../../../../components/FormsUI/switch/switch';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorMessageBox from '../../../../components/errorMsgBox/ErrorMessageBox ';
import PageTitle from '../../../../components/pageTitle/PageTitle';
import LoadingWrapper from '../../../../components/Loading';
import ValueTable from '../../../../components/ValueTable/ValueTable';

export const Branch = () => {
  const { state: mode } = useLocation();
  console.log(mode);
  const navigate = useNavigate();
  const { id: branchId } = useParams();
  const submitFormBTN = useRef(null);
  const [objectType, setObjectType] = useState([]);
  const [branchNo, setBranchNo] = useState(false);
  const [year, setYear] = useState(false);
  const [month, setMonth] = useState(false);
  const [day, setDay] = useState(false);
  const [dashes, setDashes] = useState(false);
  const [nextDisabled, setNextDisabled] = useState(true);
  const [prevDisabled, setPrevDisabled] = useState(true);
  const [firstDisabled, setFirstDisabled] = useState(true);
  const [lastDisabled, setLastDisabled] = useState(true);
  const [companyId, setCompanyId] = useState();
  const [companies, setCompanies] = useState([]);
  const [allBranches, setAllBranches] = useState([]);
  const [navigationRoute, setNavigationRoute] = useState(0);
  const [objectTypeId, setObjectTypeId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [serialSettings, setSerialSettings] = useState([]);
  const [initialValues, setInitialValues] = useState({
    nameAr: '',
    nameEn: '',
    notes: '',
    prefix: ''
  });

  const branch = useQuery({
    queryKey: ['Branches'],
    queryFn: GetAll,
    onSuccess: (result) => {
      setAllBranches(result.data.results);
      if (result.data.results[0]?.id === branchId) {
        setPrevDisabled(false);
        setFirstDisabled(false);
      }
      if (result.data.results[result.data.results.length - 1]?.id == branchId) {
        setNextDisabled(false);
        setLastDisabled(false);
      }
    }
  });

  const objectTypeLookUp = useMemo(
    () => [
      {
        header: 'Name(English)',
        accessorKey: 'nameEn'
      }
    ],
    []
  );

  const columns = [
    {
      title: 'Page',
      field: 'page',
      cellStyle: {
        minWidth: 250,
        maxWidth: 250
      },
      editComponent: ({ value, onChange }) => (
        <CustomAutocomplete
          data={objectType}
          columns={objectTypeLookUp}
          show="nameEn"
          label="Page"
          onChange={(e) => onChange(e)}
        />
      )
    },
    { title: 'Prefix', field: 'prefix' },
    {
      title: 'Branch Number',
      initialEditValue: false,
      field: 'branchNo',
      editComponent: ({ value, onChange }) => (
        <CustomSwitch onChange={(e) => onChange(e)} checked={value} isEnabled={value} />
      )
    },
    {
      title: 'Month',
      initialEditValue: false,
      field: 'month',
      editComponent: ({ value, onChange }) => (
        <CustomSwitch onChange={(e) => onChange(e)} checked={value} isEnabled={value} />
      )
    },
    {
      title: 'Day',
      initialEditValue: false,
      field: 'day',
      editComponent: ({ value, onChange }) => (
        <CustomSwitch onChange={(e) => onChange(e)} checked={value} isEnabled={value} />
      )
    },
    {
      title: 'Year',
      initialEditValue: false,
      field: 'year',
      editComponent: ({ value, onChange }) => (
        <CustomSwitch onChange={(e) => onChange(e)} checked={value} isEnabled={value} />
      )
    },
    {
      title: 'Dashes',
      initialEditValue: false,
      field: 'dashes',
      editComponent: ({ value, onChange }) => (
        <CustomSwitch onChange={(e) => onChange(e)} checked={value} isEnabled={value} />
      )
    }
  ];

  const getObjectType = useQuery({
    queryFn: GetObjectTypes,
    queryKey: ['getObjectType'],
    onError: () => {},
    onSuccess: (data) => {
      setObjectType([...data.data]);
      console.log(data);
    }
  });

  const options = {
    actions: ['Save', 'Save & close', 'Save & new'],
    handler: handleSave
  };

  const addBranchQuery = useMutation({
    mutationFn: AddBranch,
    onSuccess: (result) => {}
  });

  const { data: result, isLoading } = useQuery({
    queryKey: ['branch', branchId],
    queryFn: async () => {
      const data = await GetById(branchId);
      return data;
    },
    onSuccess: (result) => {
      console.log(result);
      if (mode !== 'add') {
        setInitialValues({
          ...initialValues,
          nameAr: result['data']['nameAr'],
          nameEn: result['data']['nameEn'],
          notes: result['data']['notes']
        });
        setSerialSettings(result.data.serialSettings);
      }
    }
  });

  const updateMutation = useMutation({
    mutationFn: Update,
    onSuccess: () => {
      alert('ok');
    }
  });

  useEffect(() => {
    getAllCompaniesLookup().then((res) => {
      setCompanies(res);
    });
  }, []);

  const hideError = () => {
    setErrorMessage('');
  };

  const FORM_VALIDATION = Yup.object().shape({
    nameAr: Yup.string().required('Required'),
    nameEn: Yup.string().required('Required'),
    notes: Yup.string()
  });

  function handleSave(action) {
    submitFormBTN.current.click();
    setNavigationRoute(action === options.actions[1] ? 1 : action === options.actions[2] ? 2 : 0);
  }

  const branchLookup = useMemo(
    () => [
      {
        header: 'Name(Arabic)',
        accessorKey: 'nameAr',
        maxSize: 5,
        sx: {
          justifyContent: 'flex-start'
        }
      },
      {
        header: 'Name(English)',
        accessorKey: 'nameEn',
        maxSize: 5
      }
    ],
    []
  );

  const AddInRow = (newData) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log(newData);
        const pageExists = serialSettings.some((setting) => setting.page === newData.page.nameEn);
        if (!pageExists) {
          setSerialSettings([
            ...serialSettings,
            {
              page: newData.page.nameEn,
              prefix: newData.prefix,
              dashes: newData.dashes,
              day: newData.day,
              counterLength: 5,
              month: newData.month,
              year: newData.year,
              branchNo: newData.branchNo
            }
          ]);
        }
        resolve();
      }, 10);
    });

  const deleteInRow = (oldData) =>
    new Promise(async (resolve, reject) => {
      setTimeout(() => {
        const rowId = oldData.page;
        setSerialSettings((costs) => costs.filter((cost) => cost.page !== rowId));
        resolve();
      }, 10);
    });

  const EditInRow = async (newData, oldData) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        const update = [...serialSettings];

        console.log(newData);
        if (!newData.page.id) {
          const index = update.findIndex((journal) => journal.page === newData.page);
          console.log(index);
          update[index] = {
            ...update[index],
            branchNo: newData.branchNo,
            dashes: newData.dashes,
            day: newData.day,
            month: newData.month,
            prefix: newData.prefix,
            year: newData.year
          };
          setSerialSettings([...update]);
        } else {
          const index = update.findIndex((journal) => journal.page === newData.page.nameEn);
          console.log(index);
          update[index] = {
            branchNo: newData.branchNo,
            dashes: newData.dashes,
            day: newData.day,
            month: newData.month,
            prefix: newData.prefix,
            year: newData.year,
            counterLength: 5,
            page: newData.page.nameEn
          };
          setSerialSettings([...update]);
        }
        resolve();
      }, 0);
    });

  function handelSubmit(values) {
    if (mode === 'add') {
      let data = {
        compnayId: companyId,
        nameAr: values.nameAr,
        nameEn: values.nameEn,
        notes: values.notes,
        serialSettings: serialSettings
      };
      console.log(data);
      const add = addBranchQuery.mutateAsync(data);
      add
        .then((res) => {
          console.log(res);
          setErrorMessage('');
          showToast('Successfully Added!!', 2000, 'success');
          setTimeout(() => {
            if (navigationRoute === 1) {
              navigate(`/organization/branch`);
            } else if (navigationRoute === 2) {
              navigate(`/organization/branch/add`, { state: 'add' });
            } else if (navigationRoute === 0) {
              navigate(`/organization/branch/edit/${res.data}`, { state: 'edit' });
            }
          }, 2000);
        })
        .catch((error) => {
          const err = Object.keys(error.response.data.errors)[0];
          showToast(`${error.response.data.errors[`${err}`]}`, 2000, 'error');
          setErrorMessage(error.response.data.errors[`${err}`]);
        });
    } else if (mode === 'edit') {
      let data = {
        nameAr: values.nameAr,
        nameEn: values.nameEn,
        notes: values.notes,
        serialSettings: serialSettings
      };
      console.log('first', data);
      //   updateMutation.mutate({ payload: data, id: branchId });
      Update({ payload: data, id: branchId })
        .then((res) => {
          console.log(res);
          showToast('Successfully Updated!!', 2000, 'success');
        })
        .catch((error) => {
          const err = Object.keys(error.response.data.errors)[0];
          showToast(`${error.response.data.errors[`${err}`]}`, 2000, 'error');
          setErrorMessage(error.response.data.errors[`${err}`]);
        });
    }
  }
  const { isOpen, drawerWidth } = useSelector((state) => state.sidebar);
  return (
    <>
      {isLoading && mode !== 'add' ? (
        <LoadingWrapper />
      ) : (
        <Formik
          enableReinitialize
          initialValues={{
            ...initialValues
          }}
          validationSchema={FORM_VALIDATION}
          onSubmit={(values, actions) => handelSubmit(values, actions)}>
          {({ values, handleSubmit, setFieldValue, resetForm, errors, touched, dirty }) => (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                backgroundColor: (theme) => (theme.palette.mode == 'dark' ? '#000' : '#153d77')
              }}>
              <ToastContainer />
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: '15px',
                  mx: '20px',
                  flexWrap: 'wrap'
                }}>
                <PageTitle
                  text={
                    mode === 'add' ? 'Add Branch' : mode === 'edit' ? 'Edit Branch' : 'View Branch'
                  }
                />
                <Box
                  sx={{
                    marginY: 0,
                    marginX: '20px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    '@media (max-width: 992px)': {
                      marginX: '0',
                      marginY: '10px'
                    }
                  }}>
                  {mode !== 'edit' ? (
                    <Box
                      sx={{
                        '@media (max-width: 576px)': {
                          marginY: '5px',
                          width: isOpen ? '50%' : '30%'
                        }
                      }}>
                      <DropdownButton
                        disabled={mode !== 'view'}
                        options={{
                          actions: ['Edit'],
                          handler: function () {
                            navigate(`/organization/branch/edit/${branchId}`, { state: 'edit' });
                          }
                        }}
                        iconName=""
                        buttonColor={''}
                        hoverText={'Edit Branche'}
                      />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        '@media (max-width: 576px)': {
                          marginY: '5px',
                          width: isOpen ? '50%' : '30%'
                        }
                      }}>
                      <DropdownButton
                        disabled={mode !== 'edit'}
                        options={{
                          actions: ['View'],
                          handler: function () {
                            navigate(`/organization/branch/edit/${branchId}`, { state: 'view' });
                          }
                        }}
                        iconName=""
                        buttonColor={''}
                        hoverText={'View Branche'}
                      />
                    </Box>
                  )}
                  <Box
                    sx={{
                      '@media (max-width: 576px)': {
                        marginY: '5px',
                        width: isOpen ? '50%' : '30%'
                      }
                    }}>
                    <DropdownButton
                      disabled={!dirty && !objectTypeId && mode === 'add'}
                      options={{
                        actions: ['New'],
                        handler: function () {
                          navigate('/organization/branch/add', { state: 'add' });
                        }
                      }}
                      iconName="addCircle"
                      buttonColor={''}
                      hoverText={'Add New Branche'}
                    />
                  </Box>
                  <Box
                    sx={{
                      '@media (max-width: 576px)': {
                        marginY: '5px',
                        width: isOpen ? '50%' : '30%'
                      }
                    }}>
                    <DropdownButton
                      disabled={!firstDisabled || mode === 'add'}
                      options={{
                        actions: ['first'],
                        handler: function () {
                          let index = 0;
                          for (let i = 0; i < allBranches.length; i++) {
                            if (allBranches[i]['id'] == branchId) {
                              console.log(index);
                              index = i;
                            }
                          }
                          if (index == 0) {
                            setFirstDisabled(false);
                          } else {
                            console.log(index);
                            navigate(
                              `/organization/branch/${mode === 'edit' ? 'edit/' : ''}${
                                allBranches[0].id
                              }`,
                              { state: `${mode}` }
                            );
                          }
                        }
                      }}
                      buttonColor={''}
                      hoverText={'Get First Branche'}
                    />
                  </Box>
                  <Box
                    sx={{
                      '@media (max-width: 576px)': {
                        marginY: '15px',
                        width: isOpen ? '50%' : '30%'
                      }
                    }}>
                    <DropdownButton
                      disabled={!prevDisabled || mode === 'add'}
                      options={{
                        actions: [],
                        handler: function () {
                          let index = 0;
                          for (let i = 0; i < allBranches.length; i++) {
                            if (allBranches[i]['id'] == branchId) {
                              index = i;
                            }
                          }
                          if (index == 0) {
                            setPrevDisabled(false);
                          } else {
                            navigate(
                              `/organization/branch/${mode === 'edit' ? 'edit/' : ''}${
                                allBranches[index - 1].id
                              }`,
                              { state: `${mode}` }
                            );
                          }
                        }
                      }}
                      iconName="ArrowBackIosIcon"
                      buttonColor={''}
                      hoverText={'Get Previos Branche'}
                    />
                  </Box>
                  <Box
                    sx={{
                      '@media (max-width: 576px)': {
                        marginY: '15px',
                        width: isOpen ? '50%' : '30%'
                      }
                    }}>
                    <DropdownButton
                      disabled={!nextDisabled || mode === 'add'}
                      options={{
                        actions: [],
                        handler: function () {
                          let index = 0;
                          for (let i = 0; i < allBranches.length; i++) {
                            if (allBranches[i]['id'] == branchId) {
                              index = i;
                            }
                          }
                          if (index == allBranches.length - 1) {
                            setNextDisabled(true);
                          } else {
                            console.log(index);
                            navigate(
                              `/organization/branch/${mode === 'edit' ? 'edit/' : ''}${
                                allBranches[index + 1].id
                              }`,
                              { state: `${mode}` }
                            );
                          }
                        }
                      }}
                      iconName="ArrowForwardIosIcon"
                      buttonColor={''}
                      hoverText={'Get Next Branche'}
                    />
                  </Box>
                  <Box
                    sx={{
                      '@media (max-width: 576px)': {
                        marginY: '15px',
                        width: isOpen ? '50%' : '30%'
                      }
                    }}>
                    <DropdownButton
                      disabled={!lastDisabled || mode === 'add'}
                      options={{
                        actions: ['last'],
                        handler: function () {
                          let index = 0;
                          for (let i = 0; i < allBranches.length; i++) {
                            if (allBranches[i]['id'] == branchId) {
                              index = i;
                            }
                          }
                          if (index == allBranches.length - 1) {
                            setLastDisabled(false);
                          } else {
                            console.log(index);
                            navigate(
                              `/organization/branch/${mode === 'edit' ? 'edit/' : ''}${
                                allBranches[allBranches.length - 1].id
                              }`,
                              { state: `${mode}` }
                            );
                          }
                        }
                      }}
                      buttonColor={''}
                      hoverText={'Get Last Branche'}
                    />
                  </Box>
                  <Box
                    sx={{
                      '@media (max-width: 576px)': {
                        marginY: '15px',
                        width: isOpen ? '50%' : '30%'
                      }
                    }}>
                    <DropdownButton
                      options={{
                        actions: ['Delete'],
                        handler: function () {
                          if (
                            !window.confirm(
                              'Are You Sure You Want To Delete ' + result?.data['nameEn']
                            )
                          ) {
                            return;
                          }
                          Delete(branchId).then((res) => {
                            navigate('/organization/branch');
                          });
                        }
                      }}
                      iconName="delete"
                      buttonColor={'red'}
                      disabled={mode === 'add'}
                      hoverText={'Delete Branche'}
                    />
                  </Box>
                  <DropdownButton
                    disabled={mode === 'view'}
                    buttonName="Save"
                    options={options}
                    icon="save"
                    iconName="save"
                    hoverText={'Save Branche Options'}
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginRight: '20px',
                  alignItems: 'center'
                }}>
                {mode === 'add' ? (
                  <PathBreadcrumbs crumbs={location.pathname.substring(1).split('/')} />
                ) : (
                  <PathBreadcrumbs
                    crumbs={location.pathname.substring(1).split('/').slice(0, -1)}
                  />
                )}
              </Box>
              <Form>
                <Section name={'Company'}>
                  <ErrorMessageBox errorMessage={errorMessage} onClose={hideError} />
                  <Grid item xs={12} md={4}>
                    {mode === 'add' ? (
                      <CustomAutocomplete
                        data={companies}
                        columns={branchLookup}
                        show="nameEn"
                        label="Companies"
                        onChange={(e) => {
                          setCompanyId(e.id);
                        }}
                      />
                    ) : (
                      <Tfield name="company" label="Company" value="" />
                    )}
                  </Grid>
                </Section>

                <Section name={'Branch'}>
                  <Grid item xs={12} md={4}>
                    {mode !== 'view' ? (
                      <Textfield
                        name="nameAr"
                        label="Arabic Name"
                        placeholder="Enter Arabic name"
                      />
                    ) : (
                      <Tfield name="nameAr" label="Arabic Name" value={result?.data['nameAr']} />
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
                      <Tfield name="nameEn" label="English Name" value={result?.data['nameEn']} />
                    )}
                  </Grid>
                  <Grid item xs={12} md={4}>
                    {mode !== 'view' ? (
                      <Textfield name="notes" label="Notes" placeholder="Enter Branch Notes" />
                    ) : (
                      <Tfield name="notes" label="Notes" value={result?.data['notes']} />
                    )}
                  </Grid>
                  <Section name={'Settings'}>
                    <ValueTable
                      col={columns}
                      data={serialSettings.length > 0 ? serialSettings : []}
                      handleAdd={mode !== 'view' ? AddInRow : ''}
                      handleDelete={mode !== 'view' ? deleteInRow : ''}
                      handleEdit={mode !== 'view' ? EditInRow : ''}
                    />
                  </Section>
                </Section>
                <Button ref={submitFormBTN} sx={{ display: 'none' }} type="submit" />
              </Form>
            </Box>
          )}
        </Formik>
      )}
    </>
  );
};
