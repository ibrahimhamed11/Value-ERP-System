import React, { useRef, useState, useEffect } from 'react';
import { Button, Grid, Box, Typography, IconButton } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import * as Yup from 'yup';
import Textfield from '../../../../components/FormsUI/Textfield';
import PathBreadcrumbs from '../../../../components/FormsUI/PathBreadcrumbs';
import { Formik, Form } from 'formik';
import showToast from '../../../../utils/toastMessage';
import { ToastContainer } from 'react-toastify';
import ErrorMessageBox from '../../../../components/errorMsgBox/ErrorMessageBox ';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import DropdownButton from '../../../../components/DropdownButton/DropDownButton';
import { AddCompany, GetById, Update, getAllLookup, Delete } from '../../api/company';
import 'react-toastify/dist/ReactToastify.css';
import BusinessIcon from '@mui/icons-material/Business';
import { useSelector } from 'react-redux';
import PageTitle from '../../../../components/pageTitle/PageTitle';
import { Section } from '../../../../components/FormsUI/Section';
import Tfield from '../../../../components/ViewUI/Textfield';
import LoadingWrapper from '../../../../components/Loading';
import ValueTable from '../../../../components/ValueTable/ValueTable';

export const Company = () => {
  const navigate = useNavigate();
  const { state: mode } = useLocation();
  const submitFormBTN = useRef(null);
  const { id: companyId } = useParams();
  const [NavigationRoute, setNavigationRoute] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [nextDisabled, setNextDisabled] = useState(true);
  const [prevDisabled, setPrevDisabled] = useState(true);
  const [firstDisabled, setFirstDisabled] = useState(true);
  const [lastDisabled, setLastDisabled] = useState(true);
  const [allCompany, setAllCompany] = useState([]);
  const [initialValues, setInitialValues] = useState({
    nameAr: '',
    nameEn: '',
    notes: ''
  });

  useEffect(() => {
    getAllLookup().then((res) => {
      setAllCompany(res);
      if (res[0]?.id == companyId) {
        setPrevDisabled(false);
        setFirstDisabled(false);
      }
      if (res[res.length - 1]?.id == companyId) {
        setNextDisabled(false);
        setLastDisabled(false);
      }
    });
  }, []);
  const addCompanyQuery = useMutation({
    mutationFn: AddCompany,
    onSuccess: (result) => {}
  });
  const FORM_VALIDATION = Yup.object().shape({
    nameAr: Yup.string().required('Required'),
    nameEn: Yup.string().required('Required'),
    notes: Yup.string()
  });
  const hideError = () => {
    setErrorMessage('');
  };

  const {
    isLoading,
    error,
    data: result
  } = useQuery(
    ['companyId', companyId],
    async () => {
      const data = await GetById(companyId);
      return data;
    },
    {
      onSuccess: (result) => {
        console.log(result);
        if (mode !== 'add') {
          setInitialValues({
            nameAr: result?.data?.nameAr || '',
            nameEn: result?.data?.nameEn || '',
            notes: result?.data?.notes || ''
          });
        }
      }
    }
  );

  const columns = [
    { title: 'English Name', field: 'nameEn' },
    { title: 'Arabic Name', field: 'nameAr' },
    { title: 'Notes', field: 'notes' }
  ];

  const options = {
    actions: ['Save', 'Save & close', 'Save & new'],
    handler: handleSave
  };
  const onRowClick = (e, rowData) => {
    navigate(`/organization/branch/${rowData['id']}`, { state: 'view' });
  };
  function handleSave(action) {
    submitFormBTN.current.click();
    setNavigationRoute(action === options.actions[1] ? 1 : action === options.actions[2] ? 2 : 0);
  }

  const SubmitAddForm = async (values, actions) => {
    console.log(values);
    if (mode === 'add') {
      try {
        const result = await addCompanyQuery.mutateAsync(values);
        if (result.status === 200) {
          showToast('Successfully Added!', 2000, 'success');
          hideError();
          setErrorMessage('');
          setTimeout(() => {
            if (NavigationRoute === 1) {
              navigate(`/organization/company`);
            } else if (NavigationRoute === 2) {
              navigate(`/organization/company/add`, { state: 'add' });
              actions.resetForm();
            } else if (NavigationRoute === 0) {
              navigate(`/organization/company/edit/${result.data}`, { state: 'edit' });
            }
          }, 2000);
        } else if (result.status === 400) {
          showToast('Please provide valid data!', 2000, 'error');
          setErrorMessage('Please provide valid data!');
        }
      } catch (error) {
        if (error.response.data.Message) {
          showToast(error.response.data.Message, 2000, 'error');
          setErrorMessage(error.response.data.Message);
        } else {
          const err = Object.keys(error.response.data.errors)[0];
          showToast(`${error.response.data.errors[`${err}`]}`, 2000, 'error');
          setErrorMessage(error.response.data.errors[`${err}`]);
        }
      }
    } else if (mode === 'edit') {
      try {
        const response = await Update({ data: values, id: companyId });
        if (response.status == 200) showToast('Successfully Updated', 1500, 'success');
        setErrorMessage('');
        setTimeout(() => {
          if (NavigationRoute === 0) {
            navigate(`/organization/company/edit/${companyId}`, { state: 'edit' });
          } else if (NavigationRoute === 1) {
            navigate(`/organization/company`);
          } else if (NavigationRoute === 2) {
            navigate(`/organization/company/add`, { state: 'add' });
          }
        }, 1500);
      } catch (error) {
        if (error.response.data.Message) {
          showToast(error.response.data.Message, 2000, 'error');
          setErrorMessage(error.response.data.Message);
        } else {
          const err = Object.keys(error.response.data.errors)[0];
          showToast(`${error.response.data.errors[`${err}`]}`, 2000, 'error');
          setErrorMessage(error.response.data.errors[`${err}`]);
        }
      }
    }
  };
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
                  flexWrap: 'wrap',
                  marginX: '20px',
                  mb: '15px',
                  alignItems: 'center'
                }}>
                <PageTitle
                  text={
                    mode === 'add'
                      ? 'Add Company'
                      : mode === 'edit'
                      ? 'Edit Company'
                      : 'View Company'
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
                          width:isOpen?"50%": '30%'
                        },
                      }}>
                      <DropdownButton
                        disabled={mode !== 'view'}
                        options={{
                          actions: ['Edit'],
                          handler: function () {
                            navigate(`/organization/company/edit/${companyId}`, { state: 'edit' });
                          }
                        }}
                        iconName=""
                        buttonColor={''}
                        hoverText={'Edit company'}
                      />{' '}
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        '@media (max-width: 576px)': {
                          marginY: '5px',
                          width:isOpen?"50%": '30%'
                        },
                      }}>
                      <DropdownButton
                        disabled={mode !== 'edit'}
                        options={{
                          actions: ['View'],
                          handler: function () {
                            navigate(`/organization/company/edit/${companyId}`, { state: 'view' });
                          }
                        }}
                        iconName=""
                        buttonColor={''}
                        hoverText={'View company'}
                      />
                    </Box>
                  )}
                  <Box
                    sx={{
                      '@media (max-width: 576px)': {
                        marginY: '5px',
                        width:isOpen?"50%": '30%'
                      },
                    }}>
                    <DropdownButton
                      disabled={!dirty && mode === 'add'}
                      options={{
                        actions: ['New'],
                        handler: function () {
                          navigate('/organization/company/add', { state: 'add' });
                        }
                      }}
                      iconName="addCircle"
                      buttonColor={''}
                      hoverText={'New company'}
                    />
                  </Box>
                  <Box
                    sx={{
                      '@media (max-width: 576px)': {
                        marginY: '5px',
                        width:isOpen?"50%": '30%'
                      },
                    }}>
                    <DropdownButton
                      disabled={!firstDisabled || mode === 'add'}
                      options={{
                        actions: ['first'],
                        handler: function () {
                          let index = 0;
                          for (let i = 0; i < allCompany.length; i++) {
                            if (allCompany[i]['id'] == companyId) {
                              index = i;
                            }
                          }
                          if (index == 0) {
                            setFirstDisabled(false);
                          } else {
                            console.log(index);
                            navigate(
                              `/organization/company/${mode === 'edit' ? 'edit/' : ''}${
                                allCompany[0].id
                              }`,
                              { state: `${mode}` }
                            );
                          }
                        }
                      }}
                      buttonColor={''}
                      hoverText={'Get First company'}
                    />
                  </Box>
                  <Box
                    sx={{
                      '@media (max-width: 576px)': {
                        marginY: '5px',
                        width:isOpen?"50%": '30%'
                      },
                    }}>
                    <DropdownButton
                      disabled={!prevDisabled || mode === 'add'}
                      options={{
                        actions: [],
                        handler: function () {
                          let index = 0;
                          for (let i = 0; i < allCompany.length; i++) {
                            if (allCompany[i]['id'] == companyId) {
                              index = i;
                            }
                          }
                          if (index == 0) {
                            setPrevDisabled(false);
                          } else {
                            console.log(index);
                            navigate(
                              `/organization/company/${mode === 'edit' ? 'edit/' : ''}${
                                allCompany[index - 1].id
                              }`,
                              { state: `${mode}` }
                            );
                          }
                        }
                      }}
                      iconName="ArrowBackIosIcon"
                      buttonColor={''}
                      hoverText={'Get Previos company'}
                    />
                  </Box>
                  <Box
                    sx={{
                      '@media (max-width: 576px)': {
                        marginY: '5px',
                        width:isOpen?"50%": '30%'
                      },
                    }}>
                    <DropdownButton
                      disabled={!nextDisabled || mode === 'add'}
                      options={{
                        actions: [],
                        handler: function () {
                          let index = 0;
                          for (let i = 0; i < allCompany.length; i++) {
                            if (allCompany[i]['id'] == companyId) {
                              index = i;
                            }
                          }
                          if (index == allCompany.length - 1) {
                            setNextDisabled(false);
                          } else {
                            console.log(index);
                            navigate(`/organization/company/edit/${allCompany[index + 1].id}`, {
                              state: `${mode}`
                            });
                          }
                        }
                      }}
                      iconName="ArrowForwardIosIcon"
                      buttonColor={''}
                      hoverText={'Get Next company'}
                    />
                  </Box>
                  <Box
                    sx={{
                      '@media (max-width: 576px)': {
                        marginY: '5px',
                        width:isOpen?"50%": '30%'
                      },
                    }}>
                    <DropdownButton
                      disabled={!lastDisabled || mode === 'add'}
                      options={{
                        actions: ['last'],
                        handler: function () {
                          let index = 0;
                          for (let i = 0; i < allCompany.length; i++) {
                            if (allCompany[i]['id'] == companyId) {
                              index = i;
                            }
                          }
                          if (index == allCompany.length - 1) {
                            setLastDisabled(false);
                          } else {
                            console.log(index);
                            navigate(
                              `/organization/company/edit/${allCompany[allCompany.length - 1].id}`,
                              { state: `${mode}` }
                            );
                          }
                        }
                      }}
                      buttonColor={''}
                      hoverText={'Get Last company'}
                    />
                  </Box>
                  <Box
                    sx={{
                      '@media (max-width: 576px)': {
                        marginY: '15px',
                        width:isOpen?"50%": '30%'
                      },
                    }}>
                    <DropdownButton
                      options={{
                        actions: ['Delete'],
                        handler: function () {
                          if (
                            !window.confirm(
                              'Are You Sure You Want To Delete Company With This Name : ' +
                                result['data']['nameEn']
                            )
                          ) {
                            return;
                          }
                          Delete(companyId)
                            .then((res) => {
                              navigate('/organization/company');
                            })
                            .catch((err) => {
                              showToast(err.response.data.Message, 2000, 'error');
                              setErrorMessage(err.response.data.Message);
                              setTimeout(() => {
                                setErrorMessage('');
                              }, 3000);
                            });
                        }
                      }}
                      iconName="delete"
                      buttonColor={'red'}
                      disabled={mode === 'add'}
                      hoverText={' Delete company'}
                    />
                  </Box>
                  <Box
                    sx={{
                      '@media (max-width: 576px)': {
                        marginY: '15px',
                        width:isOpen?"100%": '30%'
                      },
                    }}>
                    <DropdownButton
                      disabled={mode === 'view'}
                      buttonName="Save"
                      options={options}
                      icon="save"
                      iconName="save"
                      hoverText={'Save options for company'}
                    />
                  </Box>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                  width="100%"
                  sx={{ marginRight: '20px' }}>
                  <Box>
                    {mode === 'add' ? (
                      <PathBreadcrumbs crumbs={location.pathname.substring(1).split('/')} />
                    ) : (
                      <PathBreadcrumbs
                        crumbs={location.pathname.substring(1).split('/').slice(0, -1)}
                      />
                    )}
                  </Box>
                </Grid>
              </Box>
              <Form>
                <Section name={'Company'}>
                  <ErrorMessageBox errorMessage={errorMessage} onClose={hideError} />
                  <ToastContainer />
                  <Grid item xs={12} md={4}>
                    {mode !== 'view' ? (
                      <Textfield
                        name="nameAr"
                        label="Arabic Name"
                        placeholder="Enter Arabic name"
                      />
                    ) : (
                      <Tfield id="nameAr" label="Arabic Name" value={result?.data.nameAr} />
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
                      <Tfield id="nameEn" label="English Name" value={result?.data.nameEn} />
                    )}
                  </Grid>
                  <Grid item xs={12} md={4}>
                    {mode !== 'view' ? (
                      <Textfield name="notes" label="Notes" placeholder="Enter Company Notes" />
                    ) : (
                      <Tfield id="notes" label="Notes" value={result?.data.notes} />
                    )}
                  </Grid>
                </Section>
                {mode !== 'add' && (
                  <Section name={'Company Branches'}>
                    <ValueTable
                      col={columns}
                      data={result?.data.companyBranches}
                      handleRowClick={onRowClick}
                    />
                  </Section>
                )}
                <Button ref={submitFormBTN} sx={{ display: 'none' }} type="submit" />
              </Form>
            </Box>
          )}
        </Formik>
      )}
    </>
  );
};
