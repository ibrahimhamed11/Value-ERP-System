import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Button, Grid, Box, Typography, TextField } from '@mui/material';
import Textfield from '../../../../components/FormsUI/Textfield';
import PathBreadcrumbs from '../../../../components/FormsUI/PathBreadcrumbs';
import CustomSwitch from '../../../../components/FormsUI/switch/switch';
import Tfield from '../../../../components/ViewUI/Textfield';
import * as Yup from 'yup';
import CloseIcon from '@mui/icons-material/Close';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  AddGLAccount,
  getAll,
  getAllCategory,
  GetCostCenterCategoryById,
  getAllLook,
  GetById,
  Update,
  DeleteGLAccount
} from '../../api/GLAccount';
import { Formik, Form } from 'formik';
import { Section } from '../../../../components/FormsUI/Section';
import Modal from '@mui/material/Modal';
import { MaterialReactTable } from 'material-react-table';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { ToastContainer } from 'react-toastify';
import showToast from '../../../../utils/toastMessage';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import ComboBox from '../../../../components/FormsUI/Auto Complete/AutoComplete';
import PageTitle from '../../../../components/pageTitle/PageTitle';
import DropdownButton from '../../../../components/DropdownButton/DropDownButton';
import ErrorMessageBox from '../../../../components/errorMsgBox/ErrorMessageBox ';
import CustomAutocomplete from '../../../../components/customAutoComplete/CustomAutoComplete';
// import AddInRow from '../../../../components/AddInRow/AddInRow';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import LoadingWrapper from '../../../../components/Loading';
import ValueTable from '../../../../components/ValueTable/ValueTable';
import CostCenterCategoryModal from './CostCenterCategoryModal';
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

export const GLAccount = () => {
  const navigate = useNavigate();
  const { state: mode } = useLocation();
  const { id: glAccountId } = useParams();
  const submitFormBTN = useRef(null);
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const handleOpen = (index) => setOpen(true);
  const handleClose = (x) => {
    setOpen(false);
    console.log(x)
    if (x) {
      setselectedcostcenterCategory([
        ...selectedcostcenterCategory,
        {
          costCenterCategoryId: x.id,
          isRequired: x.isRequired,
          nameAr: x.nameAr,
          nameEn: x.nameEn,
          isRequired: true
        }
      ]);
    }
  };
  const [errorMessage, setErrorMessage] = useState('');
  const [required, setRequired] = useState(false);
  const [navigationRoute, setNavigationRoute] = useState(0);
  const [glAccounts, setglAccounts] = useState([]);
  const [costcenterCategoryLook, setcostcenterCategoryLook] = useState([]);
  const [costCenterCategory, setCostcenterCategory] = useState('');
  const [selectedcostcenterCategory, setselectedcostcenterCategory] = useState([]);
  const [GLAccountLookUp, setGLAccountLookUp] = useState([]);
  const [nextDisabled, setNextDisabled] = useState(true);
  const [prevDisabled, setPrevDisabled] = useState(true);
  const [firstDisabled, setFirstDisabled] = useState(true);
  const [lastDisabled, setLastDisabled] = useState(true);
  const [parentName, setParentName] = useState('');
  const [rerenderAutocomplete, setRerenderAutocomplete] = useState(false);
  const [autocompleteKey, setAutocompleteKey] = useState(0);
  const [initialValues, setInitialValues] = useState({
    nameAr: '',
    nameEn: '',
    accountNo: '',
    notes: '',
    isActive: false,
    accountNatureId: 1,
    accountStatmentId: 1,
    isTransactional: false
  });

  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    getAll().then((data) => {
      setglAccounts(data);
      if (data[0].item.id == glAccountId) {
        setPrevDisabled(false);
        setFirstDisabled(false);
      } else if (data[data.length - 1].item.id === glAccountId) {
        setNextDisabled(false);
        setLastDisabled(false);
      }
    });
    getAllCategory().then((res) => {
      setcostcenterCategoryLook(res);
    });
    getAllLook().then((res) => {
      setGLAccountLookUp(res);
    });
  }, [rerenderAutocomplete]);

  const {
    isLoading,
    error,
    data: result
  } = useQuery({
    queryKey: ['GLAccount', glAccountId],
    queryFn: async () => {
      if (mode !== 'add') {
        const data = await GetById(glAccountId);
        let cat = data.data.glAccountCostCenterCategories;
        const promises = cat.map(async (category) => {
          const res = await GetCostCenterCategoryById(category.costCenterCategoryId);
          category.nameAr = res.data.nameAr;
          category.nameEn = res.data.nameEn;
        });
        await Promise.all(promises);
        setselectedcostcenterCategory([...cat]);
        return data;
      }
    },
    onSuccess: (result) => {
      if (mode !== 'add') {
        console.log(result);
        setInitialValues({
          ...initialValues,
          nameAr: result['data']['nameAr'],
          nameEn: result['data']['nameEn'],
          accountNo: result['data']['accountNo'],
          notes: result['data']['notes'],
          accountNatureId: result['data']['accountNatureId'],
          accountStatmentId: result['data']['accountStatmentId'],
          isTransactional: result['data']['isTransactional'],
          isActive: result['data']['isActive'],
          parentId: result?.data['parentId']
        });
        if (result.data.parentId) {
          GetById(result.data.parentId).then((res) => {
            console.log(res);
            setParentName(res.data.nameEn);
          });
        }
      }
    }
  });

  const deleteInRow = (oldData) =>
    new Promise(async (resolve, reject) => {
      setTimeout(() => {
        const rowId = oldData.costCenterCategoryId;
        console.log(oldData);
        console.log(selectedcostcenterCategory);
        setselectedcostcenterCategory((costs) =>
          costs.filter((cost) => cost.costCenterCategoryId !== rowId)
        );
        resolve();
      }, 10);
    });

  const AddInRow = (newData) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log(newData);
        if (!newData.nameEn) {
          showToast('Add Cost Center Category', 2000, 'error');
        } else {
          GetCostCenterCategoryById(newData.nameEn.id).then((res) => {
            setselectedcostcenterCategory([
              ...selectedcostcenterCategory,
              {
                costCenterCategoryId: newData.nameEn.id,
                isRequired: newData.isRequired,
                nameAr: res.data.nameAr,
                nameEn: res.data.nameEn
              }
            ]);
          });
        }
        resolve();
      }, 10);
    });

  const EditInRow = async (newData, oldData) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log(oldData);
        console.log(newData);
        console.log(selectedcostcenterCategory);
        GetCostCenterCategoryById(
          newData.nameEn.id ? newData.nameEn.id : oldData.costCenterCategoryId
        ).then((res) => {
          // setselectedcostcenterCategory([...selectedcostcenterCategory, { costCenterCategoryId: newData.nameEn.id?newData.nameEn.id:oldData.costCenterCategoryId, isRequired: newData.isRequired, nameAr: res.data.nameAr, nameEn: res.data.nameEn }]);
          // setselectedcostcenterCategory((costs) =>
          //     costs.filter((cost) => cost.costCenterCategoryId !== oldData.costCenterCategoryId))
        });
        const dataUpdate = [...selectedcostcenterCategory];
        const index = dataUpdate.findIndex(
          (item) => item['costCenterCategoryId'] === newData.costCenterCategoryId
        );
        console.log(index);
        if (!newData.nameEn?.id) {
          dataUpdate[index]['isRequired'] = newData.isRequired;
          setselectedcostcenterCategory(dataUpdate);
        } else
          GetCostCenterCategoryById(newData.nameEn.id).then((res) => {
            console.log(res.data);
            console.log(dataUpdate[index]);
            dataUpdate[index]['costCenterCategoryId'] = res.data.id;
            dataUpdate[index]['nameAr'] = res.data.nameAr;
            dataUpdate[index]['nameEn'] = res.data.nameEn;
            dataUpdate[index]['isRequired'] = newData.isRequired;
            setselectedcostcenterCategory(dataUpdate);
          });

        resolve();
      }, 0);
    });

  const onRowClick = (e, rowData) => {
    navigate(`/general-ledger/master-files/CostCenterCategory/${rowData.costCenterCategoryId}`, {
      state: 'view'
    });
  };
  const AddGLAccountQuery = useMutation({
    mutationFn: AddGLAccount,
    onSuccess: (result) => {
      setModalOpen(true);
    }
  });

  const hideError = () => {
    setErrorMessage('');
  };

  const FORM_VALIDATION = Yup.object().shape({
    nameAr: Yup.string().required('Required'),
    nameEn: Yup.string().required('Required'),
    accountNo: Yup.number().required('Required'),
    notes: Yup.string().max(250, 'Notes Must Only Have 250 Char')
  });

  const options = {
    actions: ['Save', 'Save & close', 'Save & new'],
    handler: handleSave
  };
  function handleSave(action) {
    submitFormBTN.current.click();
    setNavigationRoute(action === options.actions[1] ? 1 : action === options.actions[2] ? 2 : 0);
  }

  const updateMutation = useMutation({
    mutationFn: Update,
    onSuccess: () => {
      queryClient.invalidateQueries(['GLAccount', glAccountId]);
    }
  });

  const SubmitAddForm = async (values, actions) => {
    values.costCenterCategories = selectedcostcenterCategory;
    delete values.costCenterCategory;
    console.log(values)
    if (mode === 'add') {
      try {
        const data = await AddGLAccountQuery.mutateAsync(values);
        if (data.status === 200) {
          showToast('Successfully Added!!', 2000, 'success');
          setErrorMessage('');
          setTimeout(() => {
            if (navigationRoute === 1) {
              navigate(`/general-ledger/master-files/GL-Account`);
            } else if (navigationRoute === 2) {
              navigate(`/general-ledger/master-files/GL-Account/add`, { state: 'add' });
            } else if (navigationRoute === 0) {
              navigate(`/general-ledger/master-files/GL-Account/edit/${data.data}`, {
                state: 'edit'
              });
            }
          }, 2000);
        } else {
          showToast('Please provide valid data!', 2000, 'error');
          setErrorMessage('Please provide valid data!');
        }
      } catch (error) {
        const err = Object.keys(error.response.data.errors)[0];
        showToast(`${error.response.data.errors[`${err}`]}`, 2000, 'error');
        setErrorMessage(error.response.data.errors[`${err}`]);
      }
    }
    if (mode === 'edit') {
      try {
        console.log(values);
        const response = await updateMutation.mutateAsync({
          payload: values,
          glAccountId: glAccountId
        });
        if (response.status === 200) {
          setErrorMessage('');
          setTimeout(() => {
            if (navigationRoute === 1) {
              navigate(`/general-ledger/master-files/GL-Account`);
            } else if (navigationRoute === 2) {
              navigate(`/general-ledger/master-files/GL-Account/add`, { state: 'add' });
            }
          }, 2000);
          showToast('Successfully Updated!', 2000, 'success');
        } else {
          setErrorMessage('Please provide valid data!');
        }
      } catch (error) {
        const err = Object.keys(error.response.data.errors)[0];
        showToast(`${error.response.data.errors[`${err}`]}`, 2000, 'error');
        setErrorMessage(error.response.data.errors[`${err}`]);
      }
    }
  };

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

  const GLLookUp = useMemo(
    () => [
      {
        header: 'ID',
        accessorKey: 'accountNo',
        maxSize: 5
      },
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

  const columnsss = [
    { title: 'Name(Arabic)', field: 'nameAr', editable: false },
    {
      title: 'Name(English)',
      field: 'nameEn',
      editComponent: ({ value, onChange }) => (
        <CustomAutocomplete
          data={costcenterCategoryLook}
          columns={columnss}
          show="nameEn"
          label="Cost Center"
          onChange={(e) => {
            onChange(e);
          }}
        />
      )
    },
    {
      title: 'Is Required',
      field: 'isRequired',
      initialEditValue: false,
      editComponent: ({ value, onChange }) => (
        <CustomSwitch onChange={(e) => onChange(e)} checked={value} isEnabled={value} />
      )
    }
  ];

  const columns = useMemo(
    () => [
      {
        enableEditing: false,
        maxSize: 20,
        accessorKey: 'Actions',
        Cell: ({ row }) => (
          <>
            <IconButton
              color="error"
              disabled={mode === 'view'}
              onClick={() => {
                const rowId = row.original.costCenterCategoryId;
                setselectedcostcenterCategory((accounts) =>
                  accounts.filter((account) => account.costCenterCategoryId !== rowId)
                );
              }}>
              <DeleteIcon />
            </IconButton>
          </>
        )
      },
      {
        header: 'Name (Arabic)',
        accessorKey: 'nameAr',
        enableEditing: false
      },
      {
        header: 'Name (English)',
        accessorKey: 'nameEn',
        enableEditing: false
      },
      {
        header: 'Is Required',
        accessorKey: 'isRequired',
        enableEditing: false,
        Cell: ({ row }) => (row.original.isRequired ? 'Yes' : 'No')
      }
    ],
    []
  );

  function getKeyByValue(object, value) {
    for (const key in object) {
      if (object[key] === value) {
        return key;
      }
    }
    return null;
  }

  const accountNatureId = {
    Debit: 1,
    Credit: 2
  };

  const accountStatmentId = {
    'Income Statement': 1,
    'Balance sheet': 2
  };

  const { isOpen, drawerWidth } = useSelector((state) => state.sidebar);

  useEffect(() => {
    if (true) {
      window.onbeforeunload = function () {
        return true;
      };
    }

    return () => {
      window.onbeforeunload = null;
    };
  }, []);
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
                  backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#000' : '#153d77'),
                  '@media (max-width: 488px)': {
                    width: isOpen ? '100%' : '220%'
                  }
                }}>
                <ToastContainer />
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginX: '20px',
                    mb: '15px'
                  }}>
                  <PageTitle
                    text={
                      mode === 'add'
                        ? 'Add GL Chart'
                        : mode === 'edit'
                        ? 'Edit GL Chart'
                        : 'View GL Chart'
                    }
                  />
                  <Box sx={{ display: 'flex' }}>
                    <Grid
                      item
                      sx={{
                        '@media (max-width: 600px)': {
                          marginLeft: '20px'
                        }
                      }}>
                      <Box sx={{ display: 'flex' }}>
                        {mode !== 'edit' ? (
                          <DropdownButton
                            disabled={mode !== 'view'}
                            options={{
                              actions: ['Edit'],
                              handler: function () {
                                navigate(
                                  `/general-ledger/master-files/GL-Account/edit/${glAccountId}`,
                                  { state: 'edit' }
                                );
                              }
                            }}
                            iconName=""
                            buttonColor={''}
                            hoverText={'Edit GL Account'}
                          />
                        ) : (
                          <DropdownButton
                            disabled={mode !== 'edit'}
                            options={{
                              actions: ['View'],
                              handler: function () {
                                navigate(`/general-ledger/master-files/GL-Account/${glAccountId}`, {
                                  state: 'view'
                                });
                              }
                            }}
                            iconName=""
                            buttonColor={''}
                            hoverText={'View GL Account'}
                          />
                        )}

                        <DropdownButton
                          disabled={!dirty && mode === 'add'}
                          options={{
                            actions: ['New'],
                            handler: function () {
                              navigate('/general-ledger/master-files/GL-Account/add', {
                                state: 'add'
                              });
                            }
                          }}
                          iconName="addCircle"
                          buttonColor={''}
                          hoverText={'Add GL Account'}
                        />
                        <DropdownButton
                          disabled={!firstDisabled || mode === 'add'}
                          options={{
                            actions: ['First'],
                            handler: function () {
                              let index = 0;
                              for (let i = 0; i < glAccounts.length; i++) {
                                if (glAccounts[i]['item']['id'] == glAccountId) {
                                  index = i;
                                }
                              }
                              if (index == 0) {
                                setFirstDisabled(false);
                              } else {
                                console.log(index);
                                navigate(
                                  `/general-ledger/master-files/GL-Account/${
                                    mode === 'edit' ? 'edit/' : ''
                                  }${glAccounts[0]['item'].id}`,
                                  { state: `${mode}` }
                                );
                              }
                            }
                          }}
                          buttonColor={''}
                          hoverText={'Get First GL Account'}
                        />
                        <DropdownButton
                          disabled={!prevDisabled || mode === 'add'}
                          options={{
                            actions: [],
                            handler: function () {
                              let index = 0;
                              for (let i = 0; i < glAccounts.length; i++) {
                                if (glAccounts[i]['item']['id'] == glAccountId) {
                                  index = i;
                                }
                              }
                              if (index == 0) {
                                setPrevDisabled(false);
                              } else {
                                console.log(index);
                                navigate(
                                  `/general-ledger/master-files/GL-Account/${
                                    mode === 'edit' ? 'edit/' : ''
                                  }${glAccounts[index - 1]['item'].id}`,
                                  { state: `${mode}` }
                                );
                              }
                            }
                          }}
                          iconName="ArrowBackIosIcon"
                          buttonColor={''}
                          hoverText={'Get Previos GL Account'}
                        />
                        <DropdownButton
                          disabled={!nextDisabled || mode === 'add'}
                          options={{
                            actions: [],
                            handler: function () {
                              let index = 0;
                              for (let i = 0; i < glAccounts.length; i++) {
                                if (glAccounts[i]['item']['id'] == glAccountId) {
                                  index = i;
                                }
                              }
                              if (index == glAccounts.length - 1) {
                                setNextDisabled(true);
                              } else {
                                console.log(index);
                                navigate(
                                  `/general-ledger/master-files/GL-Account/${
                                    mode === 'edit' ? 'edit/' : ''
                                  }${glAccounts[index + 1]['item'].id}`,
                                  { state: `${mode}` }
                                );
                              }
                            }
                          }}
                          iconName="ArrowForwardIosIcon"
                          buttonColor={''}
                          hoverText={'Get Next GL Account'}
                        />
                        <DropdownButton
                          disabled={!lastDisabled || mode === 'add'}
                          options={{
                            actions: ['Last'],
                            handler: function () {
                              let index = 0;
                              for (let i = 0; i < glAccounts.length; i++) {
                                if (glAccounts[i]['item']['id'] == glAccountId) {
                                  index = i;
                                }
                              }
                              if (index == glAccounts.length - 1) {
                                setFirstDisabled(false);
                              } else {
                                console.log(index);
                                navigate(
                                  `/general-ledger/master-files/GL-Account/${
                                    mode === 'edit' ? 'edit/' : ''
                                  }${glAccounts[glAccounts.length - 1]['item'].id}`,
                                  { state: `${mode}` }
                                );
                              }
                            }
                          }}
                          buttonColor={''}
                          hoverText={'Get Last GL Account'}
                        />
                        <DropdownButton
                          options={{
                            actions: ['Delete'],
                            handler: function () {
                              if (!window.confirm('Are You Sure You Want To Delete This')) {
                                return;
                              }
                              DeleteGLAccount(glAccountId).then((res) => {
                                navigate('/general-ledger/master-files/GL-Account');
                              });
                            }
                          }}
                          iconName="delete"
                          buttonColor={'red'}
                          disabled={mode === 'add'}
                          hoverText={'Delete GL Account'}
                        />
                      </Box>
                    </Grid>
                    <DropdownButton
                      buttonName="Save"
                      options={options}
                      icon="save"
                      iconName="save"
                      hoverText={'Save GL Account Options'}
                    />
                  </Box>
                </Box>
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
                  <Section name={'GLAccount'}>
                    <ErrorMessageBox errorMessage={errorMessage} onClose={hideError} />
                    <Grid item xs={12} md={4}>
                      {mode === 'add' ? (
                        <Textfield
                          name="accountNo"
                          label="Account Num"
                          placeholder="Enter Account Number"
                        />
                      ) : (
                        <Tfield
                          value={result?.data['accountNo']}
                          label="Account Num"
                          placeholder="Enter Account Number"
                        />
                      )}
                    </Grid>
                    <Grid item xs={12} md={4}>
                      {mode !== 'view' ? (
                        <ComboBox
                          options={Object.keys(accountNatureId)}
                          name="accountNatureId"
                          onChange={(_, newValue) => {
                            setFieldValue('accountNatureId', accountNatureId[newValue]);
                          }}
                          values={getKeyByValue(accountNatureId, values.accountNatureId)}
                          label="Account Nature"
                        />
                      ) : (
                        <Tfield
                          name="accountNatureId"
                          label="Account Nature"
                          value={
                            result?.data['accountNatureId'] === 1
                              ? 'Debit'
                              : result?.data['accountNatureId'] === 2
                              ? 'Credit'
                              : ''
                          }
                        />
                      )}
                    </Grid>
                    <Grid item xs={12} md={4}>
                      {mode !== 'view' ? (
                        <ComboBox
                          options={Object.keys(accountStatmentId)}
                          name="accountStatmentId"
                          onChange={(_, newValue) => {
                            setFieldValue('accountStatmentId', accountStatmentId[newValue]);
                          }}
                          values={getKeyByValue(accountStatmentId, values.accountStatmentId)}
                          label="Final Statement"
                        />
                      ) : (
                        <Tfield
                          name="accountStatmentId"
                          label="Final Statement"
                          value={
                            result?.data['accountStatmentId'] === 1
                              ? 'Income Statement'
                              : result?.data['accountStatmentId'] === 2
                              ? 'Balance Sheet'
                              : ''
                          }
                        />
                      )}
                    </Grid>
                    <Grid item xs={12} md={4}>
                      {mode !== 'view' ? (
                        <Textfield name="notes" label="Notes" placeholder="Enter Account Notes" />
                      ) : (
                        <Tfield id="notes" label="Notes" value={result?.data['notes']} />
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
                          data={GLAccountLookUp}
                          columns={GLLookUp}
                          show="nameEn"
                          label="parent"
                          value={result?.data['parentId']}
                          onChange={(e) => {
                            setFieldValue('parentId', e.id);
                          }}
                        />
                      ) : (
                        <Tfield id="parentId" label="Parent" value={parentName} />
                      )}
                    </Grid>
                    <Grid item xs={12} md={8}></Grid>
                    <Grid item xs={6}>
                      <CustomSwitch
                        onChange={(newValue) => setFieldValue('isActive', !newValue)}
                        labelOn="InActive"
                        labelOff="InActive"
                        label="Is Active"
                        isEnabled={mode !== 'add' && !result?.data?.isActive}
                        disabled={mode === 'view'}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <CustomSwitch
                        onChange={(newValue) => setFieldValue('isTransactional', newValue)}
                        labelOn="Transactional"
                        labelOff="Transactional"
                        label="Is Transactional"
                        isEnabled={mode !== 'add' && result?.data?.isTransactional}
                        disabled={mode === 'view'}
                      />
                    </Grid>
                  </Section>
                  <Button ref={submitFormBTN} sx={{ display: 'none' }} type="submit" />
                </Form>
                {/* <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description">
                  <Box sx={style}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px',
                        backgroundColor: '#153D77',
                        padding: '5px 20px'
                      }}>
                      <Typography
                        sx={{
                          color: (theme) => (theme.palette.mode == 'dark' ? 'white' : 'white'),
                          fontFamily: 'Roboto',
                          textAlign: 'center',
                          fontWeight: 'bold',
                          marginBottom: '10px'
                        }}
                        variant="h3">
                        Cost Center Category
                      </Typography>
                      <CloseIcon
                        onClick={() => {
                          handleClose();
                          setCostcenterCategory('');
                        }}
                        sx={{ color: 'white', cursor: 'pointer' }}
                      />
                    </Box>
                    <Grid container alignItems={'center'} sx={{ padding: '0 15px' }}>
                      <Grid item xs={9} sx={{ marginBottom: '10px' }}>
                        <CustomAutocomplete
                          data={costcenterCategoryLook}
                          columns={columnss}
                          show="nameEn"
                          label="Cost Center Category"
                          onChange={(e) => {
                            setCostcenterCategory(e.id);
                          }}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <CustomSwitch
                          onChange={() => {
                            setRequired(!required);
                          }}
                          labelOn="Require"
                          labelOff="Require"
                          label="Require"
                        />
                      </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <DropdownButton
                        disabled={0}
                        options={{
                          actions: ['Add'],
                          handler: function () {
                            if (!costCenterCategory) {
                              showToast('Add Cost Center Category', 2000, 'error');
                            } else {
                              GetCostCenterCategoryById(costCenterCategory).then((res) => {
                                setselectedcostcenterCategory([
                                  ...selectedcostcenterCategory,
                                  {
                                    costCenterCategoryId: costCenterCategory,
                                    isRequired: required,
                                    nameAr: res.data.nameAr,
                                    nameEn: res.data.nameEn
                                  }
                                ]);
                              });
                              handleClose();
                              setRequired(false);
                              setCostcenterCategory('');
                            }
                          }
                        }}
                        iconName="addCircle"
                        buttonColor={''}
                      />
                    </Box>
                  </Box>
                </Modal> */}
                <CostCenterCategoryModal open={open} handleClose={(x) => handleClose(x)} />
              </Box>
            )}
          </Formik>
          <Section name={'Cost Center Categories'}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                width: '100%',
                alignItems: 'center'
              }}>
              {/* {
                                    mode !== "view" &&
                                    <AddInRow>
                                        <Grid item xs={7} >
                                            <CustomAutocomplete key={autocompleteKey} data={costcenterCategoryLook} columns={columnss} show="nameEn" label="Cost Center Category" onChange={(e) => {
                                                setCostcenterCategory(e.id);
                                            }} />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <CustomSwitch
                                                key={autocompleteKey}
                                                onChange={() => {
                                                    setRequired(!required)
                                                }}
                                                labelOn="Require"
                                                labelOff="Require"
                                                label="Require"
                                            />
                                        </Grid>
                                        <Grid>
                                            <Button
                                                onClick={() => {
                                                    if (!costCenterCategory) {
                                                        showToast("Add Cost Center Category", 2000, "error");
                                                    } else {
                                                        GetCostCenterCategoryById(costCenterCategory).then((res) => {
                                                            setselectedcostcenterCategory([...selectedcostcenterCategory, { costCenterCategoryId: costCenterCategory, isRequired: required, nameAr: res.data.nameAr, nameEn: res.data.nameEn }])
                                                        })
                                                        setRequired(false)
                                                        setCostcenterCategory("")
                                                        setRerenderAutocomplete(!rerenderAutocomplete);
                                                        setAutocompleteKey(autocompleteKey + 1);
                                                    }
                                                }}
                                                sx={{
                                                    height: "40px",
                                                    marginBottom: "15px",
                                                    width: "80px"
                                                }} variant="contained">Add</Button>
                                        </Grid>
                                    </AddInRow>
                                } */}
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
                                    muiTableBodyProps={{
                                        sx: (theme) => ({
                                            '& tr:hover td': {
                                                backgroundColor: (theme) => theme.palette.mode == "dark" && "#4c3838"
                                            }
                                        })
                                    }}


                                    columns={columns}
                                    data={selectedcostcenterCategory}
                                    filterFromLeafRows
                                    initialState={{
                                        expanded: true,
                                        density: 'compact'
                                    }}
                                    paginateExpandedRows={false}
                                    positionToolbarAlertBanner="bottom"
                                    //Edite
                                    enableColumnOrdering
                                /> */}
              <ValueTable
                col={columnsss}
                data={selectedcostcenterCategory}
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
