import React, { useRef, useState, useEffect } from 'react';
import { Button, Grid, Box, Typography } from '@mui/material';
import { useMemo } from 'react';
import Textfield from '../../../../components/FormsUI/Textfield';
import Tfield from '../../../../components/ViewUI/Textfield';
import ComboBox from '../../../../components/FormsUI/Auto Complete/AutoComplete';
import PathBreadcrumbs from '../../../../components/FormsUI/PathBreadcrumbs';
import { MaterialReactTable } from 'material-react-table';
import * as Yup from 'yup';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DropdownButton from '../../../../components/DropdownButton/DropDownButton';
import {
  getAllGLAccount,
  DeleteJournal,
  Update,
  getCostCenterById,
  addJournal,
  GetGLById,
  getAllLook,
  getAllLookup,
  GetCostCenteCategoryById,
  GetById,
  getAll
} from './../../api/journal';
import { Formik, Form } from 'formik';
import { Section } from '../../../../components/FormsUI/Section';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { Edit as EditIcon } from '@mui/icons-material';
import showToast from '../../../../utils/toastMessage';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import ErrorMessageBox from '../../../../components/errorMsgBox/ErrorMessageBox ';
import CustomAutocomplete from '../../../../components/customAutoComplete/CustomAutoComplete';
// import AddInRow from '../../../../components/AddInRow/AddInRow';
import PageTitle from '../../../../components/pageTitle/PageTitle';
import moment from 'moment';
import ValueTable from '../../../../components/ValueTable/ValueTable';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 1200,
  maxWidth: '80vw', // Set a maximum width for responsiveness
  maxHeight: '80vh', // Set a maximum height for responsiveness
  overflowY: 'auto', // Enable vertical scrolling
  bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1E1E1E' : 'background.paper'),
  borderRadius: '8px', // Fix typo in 'borderRadius'
  boxShadow: 24,
  padding: '0 0 12px'
};

export const Journal = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state: mode } = useLocation();
  const [open, setOpen] = React.useState(false);
  const handleOpen = (index) => setOpen(true);
  const handleClose = () => setOpen(false);
  const [theGLAccount, setTheGLAccount] = useState();
  const [costCenterOpen, setCostCenterOpen] = React.useState(false);
  const handleCostCenterOpen = () => setCostCenterOpen(true);
  const handleCostCenterClose = () => setCostCenterOpen(false);
  const [allGLAccount, setAllGLAccount] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [costCenters, setCostCenters] = useState([]);
  const [modalType, setModalType] = useState('');
  const [modalId, setModalId] = useState('');
  const [modalDescription, setModalDescription] = useState('');
  const [costCenterID, setCostCenterId] = useState('');
  const [costCenterAmount, setCostCenterAmount] = useState();
  const [modalAmount, setModalAmount] = useState('');
  const [data, setData] = useState();
  const [GLAccount, setGLAccount] = useState([]);
  const [NavigationRoute, setNavigationRoute] = useState(0);
  const [rerenderAutocomplete, setRerenderAutocomplete] = useState(false);
  const [autocompleteKey, setAutocompleteKey] = useState(0);
  const [modalEntryCostCenter, setModalEntryCostCenter] = useState([]);
  const [allJournals, setAllJournals] = useState([]);
  const [nextDisabled, setNextDisabled] = useState(true);
  const [prevDisabled, setPrevDisabled] = useState(true);
  const [firstDisabled, setFirstDisabled] = useState(true);
  const [lastDisabled, setLastDisabled] = useState(true);
  const [modalRemainingAmount, setModalRemainingAmount] = useState(0);
  const [initialValues, setInitialValues] = useState({
    description: '',
    year: new Date().getFullYear().toString(),
    reference: '',
    sourceType: '',
    sourceApplication: 'GL',
    entryTypeId: '',
    balanceTypeId: ''
  });

  useEffect(() => {
    //Get All Journals
    getAll().then((res) => {
      setAllJournals(res);
      console.log(res);
      if (res[0]?.id == id) {
        setPrevDisabled(false);
        setFirstDisabled(false);
      }
      if (res[res.length - 1]?.id === id) {
        setNextDisabled(false);
        setLastDisabled(false);
      }
    });
  }, [GLAccount, theGLAccount?.costCenters]);

  useEffect(() => {
    // Get All GL Accounts
    getAllLook().then((res) => {
      setAllGLAccount(res);
    });
    // Get The Journal Which Click On
    if (id) {
      GetById(id).then((res) => {
        console.log(res);
        setInitialValues({
          ...initialValues,
          description: res?.data.description,
          reference: res?.data.reference,
          sourceType: res?.data.sourceType,
          entryTypeId: res?.data.entryTypeId,
          balanceTypeId: res?.data.balanceTypeId
        });
        setData(res.data);
        const glAccountPromises = res.data.journalDetails.map((detail) =>
          GetGLById(detail.glAccountId)
        );
        Promise.all(glAccountPromises)
          .then((results) => {
            const updatedGLAccount = results.map((result, index) => {
              const detail = res.data.journalDetails[index];
              const obj = {
                id: detail.glAccountId,
                nameAr: result.data.nameAr,
                nameEn: result.data.nameEn,
                accountNo: result.data.accountNo,
                entryNumber: detail.journalDetailNo,
                description: detail.description
              };
              if (detail.credit > detail.debit) {
                obj.type = 'credit';
                obj.amount = detail.credit;
              } else {
                obj.type = 'debit';
                obj.amount = detail.debit;
              }
              let costCenters = [];
              for (let i = 0; i < detail.journalDetailCostCenters.length; i++) {
                let object = {};
                getCostCenterById(detail.journalDetailCostCenters[i].costCenterId).then((res) => {
                  console.log(res);
                  object.id = res.data.id;
                  object.nameAr = res.data.nameAr;
                  object.nameEn = res.data.nameEn;
                  object.costCenterNo = res.data.costCenterNo;
                  object.amount = detail.journalDetailCostCenters[i].amount;
                  object.categoryId = res.data.costCenterCategoryId;
                });
                costCenters.push(object);
              }
              obj.costCenters = costCenters;
              return obj;
            });

            setGLAccount(updatedGLAccount);
          })
          .catch((error) => {
            console.error('Error fetching GL accounts:', error);
          });
      });
    }
  }, []);

  function getKeyByValue(object, value) {
    for (const key in object) {
      if (object[key] === value) {
        return key;
      }
    }
    return null;
  }

  const SubmitAddForm = async (values, actions) => {
    const {
      year,
      sourceType,
      sourceApplication,
      reference,
      entryTypeId,
      description,
      balanceTypeId
    } = values;
    let journalDetails = [];
    for (let i = 0; i < GLAccount.length; i++) {
      let obj = {};
      obj['glAccountId'] = GLAccount[i].id;
      if (GLAccount[i].type === 'credit') {
        obj['credit'] = GLAccount[i].amount;
      } else if (GLAccount[i].type === 'debit') {
        obj['debit'] = GLAccount[i].amount;
      }
      obj['description'] = GLAccount[i].description;
      let costCenters = [];
      for (let j = 0; j < GLAccount[i].costCenters.length; j++) {
        let obj2 = {};
        obj2['costCenterId'] = GLAccount[i].costCenters[j].id;
        obj2['costCenterCategoryId'] = GLAccount[i].costCenters[j].categoryId;
        obj2['amount'] = GLAccount[i].costCenters[j].amount;
        costCenters.push(obj2);
      }
      obj['costCenters'] = costCenters;
      journalDetails.push(obj);
    }
    const newValues = {
      year: year,
      description: description,
      entryTypeId: parseInt(entryTypeId),
      sourceType: sourceType,
      balanceTypeId: parseInt(balanceTypeId),
      sourceApplication: sourceApplication,
      reference: reference,
      journalDetails: journalDetails
    };
    // Save In Add Mode
    if (mode === 'add') {
      addJournal(newValues)
        .then((res) => {
          if (res.status === 200) {
            showToast('journal added successfully', 2000, 'success');
            setTimeout(() => {
              if (NavigationRoute === 1) {
                navigate(`/general-ledger/transactions/journal`);
              } else if (NavigationRoute === 2) {
                navigate(`/general-ledger/transactions/journal/add`, { state: 'add' });
              } else if (NavigationRoute === 0) {
                navigate(`/general-ledger/transactions/journal/edit/${res.data}`, {
                  state: 'edit'
                });
              }
            }, 2000);
          } else {
            showToast('error', 2000, 'error');
          }
        })
        .catch((error) => {
          showToast(error.response.data.Message, 2000, 'error');
          setErrorMessage(error.response.data.Message);
          console.log(error.response.data.Message);
        });
    }
    // Save In Edit Mode
    else if (mode === 'edit') {
      Update({ data: newValues, journalId: id })
        .then((res) => {
          if (res.status === 200) {
            showToast('journal Updated successfully', 2000, 'success');
            setTimeout(() => {
              if (NavigationRoute === 1) {
                navigate(`/general-ledger/transactions/journal`);
              } else if (NavigationRoute === 2) {
                navigate(`/general-ledger/transactions/journal/add`, { state: 'add' });
              } else if (NavigationRoute === 0) {
                navigate(`/general-ledger/transactions/journal/edit/${res.data}`, {
                  state: 'edit'
                });
              }
            }, 2000);
          } else {
            showToast('error', 2000, 'error');
          }
        })
        .catch((error) => {
          showToast(error.response.data.Message, 2000, 'error');
          setErrorMessage(error.response.data.Message);
          console.log(error.response.data.Message);
        });
    }
  };

  // for GL AutoComplete Grid
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
  const submitFormBTN = useRef(null);
  // for entry details Grid
  // const columns = useMemo(
  //     () => [
  //         {
  //             enableEditing: false,
  //             maxSize: 20,
  //             accessorKey: 'Actions',
  //             Cell: ({ row }) => (
  //                 <>
  //                     <IconButton color="error"
  //                         disabled={mode === "view"}
  //                         onClick={() => {
  //                             const rowId = row.original.id;
  //                             setGLAccount((accounts) =>
  //                                 accounts.filter((account) => account.id !== rowId)
  //                             );
  //                         }} >
  //                         <DeleteIcon />
  //                     </IconButton>
  //                     <IconButton
  //                         onClick={async () => {
  //                             const rowId = row.original.id;
  //                             const filteredAccounts = GLAccount.filter((account) => account.id === rowId);
  //                             setTheGLAccount({ ...filteredAccounts[0] })
  //                             const glResponse = await GetGLById(filteredAccounts[0].id);
  //                             for (let i = 0; i < glResponse.data.glAccountCostCenterCategories.length; i++) {
  //                                 const costCenterCategoryResponse = await GetCostCenteCategoryById(
  //                                     glResponse.data.glAccountCostCenterCategories[i].costCenterCategoryId
  //                                 );
  //                                 let costt = costCenterCategoryResponse.data.costCenters
  //                                 let c = costt.filter((cost) => cost.isActive === true)
  //                                 setCostCenters((prevCostCenters) => [
  //                                     ...prevCostCenters,
  //                                     ...c,
  //                                 ]);
  //                             }
  //                             handleCostCenterOpen()
  //                         }}
  //                     >
  //                         <EditIcon />
  //                     </IconButton>
  //                 </>
  //             )
  //         },
  //         {
  //             header: '#Line',
  //             accessorKey: 'rowIndex',
  //             enableEditing: false,
  //             Cell: ({ row }) => <span>#{row.index + 1}</span>,
  //         },
  //         {
  //             header: 'ID',
  //             accessorKey: 'accountNo',
  //             enableClickToCopy: true,
  //             enableEditing: false,
  //             sx: {
  //                 justifyContent: 'flex-start'
  //             }
  //         },
  //         {
  //             header: 'Account',
  //             accessorKey: 'nameEn',
  //             enableClickToCopy: true,
  //             enableEditing: false
  //         },
  //         {
  //             header: 'Type',
  //             accessorKey: 'type',
  //             enableClickToCopy: true,
  //             enableEditing: false
  //         },
  //         {
  //             header: 'Description',
  //             accessorKey: 'description',
  //             enableClickToCopy: true,
  //             enableEditing: false
  //         },
  //         {
  //             header: 'Amount',
  //             accessorKey: 'amount',
  //             enableClickToCopy: true,
  //         },
  //     ],
  //     [GLAccount]
  // );
  const columns = [
    { title: '#line', render: (rowData) => rowData.tableData.id + 1, editable: false },
    { title: 'Name(Arabic)', field: 'nameAr', editable: false },
    {
      title: 'Name (English)',
      field: 'nameEn',
      cellStyle: {
        minWidth: 400,
        maxWidth: 400
      },
      editComponent: ({ value, onChange }) => (
        <CustomAutocomplete
          data={allGLAccount}
          columns={GLLookUp}
          show="nameEn"
          label="GLAccount"
          onChange={(e) => {
            onChange(e);
          }}
        />
      )
    },
    {
      title: 'Amount',
      field: 'amount',
      cellStyle: {
        minWidth: 200,
        maxWidth: 200
      },
      type: 'numeric'
    },
    {
      title: 'Description',
      field: 'description',
      cellStyle: {
        minWidth: 200,
        maxWidth: 200
      }
    },
    { title: 'Type', field: 'type', editable: false }
  ];

  const colum = [
    {
      title: 'ID',
      field: 'costCenterNo',
      cellStyle: {
        minWidth: 300,
        maxWidth: 300
      },
      editComponent: ({ value, onChange }) => (
        <CustomAutocomplete
          data={costCenters}
          columns={costCentersLookUp}
          show="costCenterNo"
          label="Cost Center Id"
          onChange={(e) => {
            onChange(e);
          }}
        />
      )
    },
    { title: 'Name(Arabic)', field: 'nameAr', editable: false },
    { title: 'Name(English)', field: 'nameEn', editable: false },
    { title: 'Amount', field: 'amount', type: 'numeric' }
  ];

  const onRowClick = async (e, rowData) => {
    await new Promise((resolve, reject) => {
      setTimeout(async () => {
        const rowId = rowData.id;
        const filteredAccounts = GLAccount.filter((account) => account.id === rowId);
        setTheGLAccount({ ...filteredAccounts[0] });
        const glResponse = await GetGLById(filteredAccounts[0].id);
        for (let i = 0; i < glResponse.data.glAccountCostCenterCategories.length; i++) {
          const costCenterCategoryResponse = await GetCostCenteCategoryById(
            glResponse.data.glAccountCostCenterCategories[i].costCenterCategoryId
          );
          let costt = costCenterCategoryResponse.data.costCenters;
          let c = costt.filter((cost) => cost.isActive === true);
          setCostCenters((prevCostCenters) => [...prevCostCenters, ...c]);
        }
        handleCostCenterOpen();
        resolve();
      }, 10);
    });
  };

  const deleteInRow = (oldData) =>
    new Promise(async (resolve, reject) => {
      setTimeout(() => {
        const rowId = oldData.id;
        setGLAccount((accounts) => accounts.filter((account) => account.id !== rowId));
        resolve();
      }, 10);
    });

  const AddInRow = (newData) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log(newData);
        if (!newData.nameEn) {
          showToast('Add GL Account first', 2000, 'error');
        } else if (newData.amount <= 0) {
          showToast('You must have a positive amount', 2000, 'error');
        } else {
          const isExistingGLAccount = GLAccount.some((account) => account.id === newData.nameEn.id);

          if (isExistingGLAccount) {
            showToast('GL Account already exists', 2000, 'error');
          } else {
            GetGLById(newData.nameEn.id).then((res) => {
              console.log(res);
              let type;
              if (res.data.accountNatureId === 1) {
                type = 'debit';
              } else {
                type = 'credit';
              }
              let GLAccountData = {
                id: newData.nameEn.id,
                type: type,
                nameEn: res.data.nameEn,
                nameAr: res.data.nameAr,
                amount: newData.amount,
                description: newData.description,
                remainingAmount: newData.amount,
                accountNo: res.data.accountNo,
                costCenters: []
              };
              setGLAccount([...GLAccount, GLAccountData]);
            });
            showToast('GL Account Added Successfully', 2000, 'success');
          }
        }
        resolve();
      }, 10);
    });

  const EditInRow = async (newData, oldData) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log(newData);
        const dataUpdate = [...GLAccount];
        const index = dataUpdate.findIndex((item) => item['id'] === newData.id);
        if (newData.nameEn.id) {
          GetGLById(newData.nameEn.id).then((res) => {
            console.log(res);
            let type;
            if (res.data.accountNatureId === 1) {
              type = 'debit';
            } else {
              type = 'credit';
            }
            let GLAccountData = {
              id: newData.nameEn.id,
              type: type,
              nameEn: res.data.nameEn,
              nameAr: res.data.nameAr,
              amount: newData.amount,
              description: newData.description,
              remainingAmount: newData.amount,
              accountNo: res.data.accountNo,
              costCenters: []
            };
            dataUpdate[index] = GLAccountData;
            console.log(dataUpdate);
            setGLAccount([...dataUpdate]);
          });
        } else {
          dataUpdate[index] = {
            ...dataUpdate[index],
            amount: newData.amount,
            description: newData.description
          };
          setGLAccount([...dataUpdate]);
        }
        resolve();
      }, 0);
    });

  const editModalDeleteInRow = (oldData) =>
    new Promise(async (resolve, reject) => {
      setTimeout(() => {
        const rowId = oldData.id;
        const updatedTheGLAccount = { ...theGLAccount };
        updatedTheGLAccount.costCenters = updatedTheGLAccount?.costCenters?.filter(
          (center) => center.id !== rowId
        );
        updatedTheGLAccount.remainingAmount =
          updatedTheGLAccount.remainingAmount + parseInt(oldData.amount);
        const updatedGLAccount = GLAccount?.map((account) => {
          if (account.id === theGLAccount.id) {
            return updatedTheGLAccount;
          }
          return account;
        });
        setGLAccount(updatedGLAccount);
        setTheGLAccount(updatedTheGLAccount);
        resolve();
      }, 10);
    });

  const editModalAddInRow = (newData) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log(newData);
        if (!newData.costCenterNo) {
          showToast('add Cost Center First', 2000, 'error');
        } else {
          getCostCenterById(newData.costCenterNo.id).then((res) => {
            const center = {
              id: res.data.id,
              categortId: res.data.costCenterCategoryId,
              nameAr: res.data.nameAr,
              costCenterNo: res.data.costCenterNo,
              nameEn: res.data.nameEn,
              amount: newData.amount
            };

            const costCenterExists = theGLAccount.costCenters.some(
              (existingCenter) => existingCenter.id === center.id
            );
            if (costCenterExists) {
              showToast('that cost center already exist under that GLAccount', 2000, 'error');
            } else if (parseInt(newData.amount) > parseInt(theGLAccount.remainingAmount)) {
              showToast('The Remaining Amount is not Enough', 2000, 'error');
            } else {
              const updatedTheGLAccount = {
                ...theGLAccount,
                costCenters: [...theGLAccount.costCenters, center]
              };
              updatedTheGLAccount.remainingAmount =
                parseInt(updatedTheGLAccount.remainingAmount) - parseInt(newData.amount);
              setTheGLAccount(updatedTheGLAccount);
              setTheGLAccount((prevGLAccount) => {
                const updatedGLAccount = {
                  ...prevGLAccount,
                  remainingAmount: updatedTheGLAccount.remainingAmount
                };
                return updatedGLAccount;
              });
              const updatedGLAccount = GLAccount.map((account) => {
                if (account.id === updatedTheGLAccount.id) {
                  return updatedTheGLAccount;
                }
                return account;
              });
              setGLAccount(updatedGLAccount);
              showToast('Cost Center Added Successfully', 2000, 'success');
            }
          });
        }

        resolve();
      }, 10);
    });

  const modalDeleteInRow = (oldData) =>
    new Promise(async (resolve, reject) => {
      setTimeout(() => {
        const rowId = oldData.id;
        setModalRemainingAmount(modalRemainingAmount + parseInt(oldData.amount));
        const updatedTheGLAccount = [...modalEntryCostCenter];
        const updatedTheGLAccountWithoutRow = updatedTheGLAccount.filter(
          (cost) => cost.id !== rowId
        );
        setModalEntryCostCenter(updatedTheGLAccountWithoutRow);
        resolve();
      }, 10);
    });
  const modalAddInRow = (newData) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        setCostCenters([]);
        if (!newData.costCenterNo) {
          showToast('add Cost Center First', 2000, 'error');
        } else if (parseInt(newData.amount) > parseInt(modalRemainingAmount)) {
          showToast('The Remaining Amount is not Enough', 2000, 'error');
        } else {
          getCostCenterById(newData.costCenterNo.id).then((res) => {
            const center = {
              id: res.data.id,
              costCenterNo: res.data.costCenterNo,
              categoryId: res.data.costCenterCategoryId,
              nameAr: res.data.nameAr,
              nameEn: res.data.nameEn,
              amount: newData.amount
            };
            if (0) {
              showToast('that cost center already exist under that GLAccount', 2000, 'error');
            } else {
              setModalEntryCostCenter([...modalEntryCostCenter, center]);
              setModalRemainingAmount(parseInt(modalRemainingAmount) - parseInt(newData.amount));
            }
          });
        }
        console.log(newData);

        resolve();
      }, 10);
    });

  const modalEditInRow = async (newData, oldData) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        const update = [...modalEntryCostCenter];
        console.log(update);
        console.log(newData);
        console.log(oldData);
        const index = update.findIndex((item) => item['id'] === newData.id);
        if (!newData.costCenterNo.id) {
          update[index] = { ...update[index], amount: newData.amount };
          setModalRemainingAmount(
            parseInt(modalRemainingAmount) + parseInt(oldData.amount) - parseInt(newData.amount)
          );
          setModalEntryCostCenter([...update]);
        } else {
          getCostCenterById(newData.costCenterNo.id).then((res) => {
            const center = {
              id: res.data.id,
              costCenterNo: res.data.costCenterNo,
              categoryId: res.data.costCenterCategoryId,
              nameAr: res.data.nameAr,
              nameEn: res.data.nameEn,
              amount: newData.amount
            };
            update[index] = center;
            setModalRemainingAmount(
              parseInt(modalRemainingAmount) + parseInt(oldData.amount) - parseInt(newData.amount)
            );
            setModalEntryCostCenter([...update]);
          });
        }
        resolve();
      }, 0);
    });
  // for cost centers Grid in modal
  const column = useMemo(
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
                const rowId = row.original.id;
                const updatedTheGLAccount = { ...theGLAccount };
                updatedTheGLAccount.costCenters = updatedTheGLAccount?.costCenters?.filter(
                  (center) => center.id !== rowId
                );
                updatedTheGLAccount.remainingAmount =
                  updatedTheGLAccount.remainingAmount + parseInt(row.original.amount);
                const updatedGLAccount = GLAccount?.map((account) => {
                  if (account.id === theGLAccount.id) {
                    return updatedTheGLAccount;
                  }
                  return account;
                });
                setGLAccount(updatedGLAccount);
                setTheGLAccount(updatedTheGLAccount);
              }}>
              <DeleteIcon />
            </IconButton>
          </>
        )
      },
      {
        header: 'ID',
        accessorKey: 'costCenterNo',
        enableClickToCopy: true,
        enableEditing: false,
        sx: {
          justifyContent: 'flex-start'
        }
      },
      {
        header: 'Name (Arabic)',
        accessorKey: 'nameAr',
        enableClickToCopy: true,
        enableEditing: false
      },
      {
        header: 'Name (English)',
        accessorKey: 'nameEn',
        enableClickToCopy: true,
        enableEditing: false
      },
      {
        header: 'Amount',
        accessorKey: 'amount',
        enableClickToCopy: true
      }
    ],
    [GLAccount, theGLAccount, theGLAccount?.costCenters]
  );
  // const colum = useMemo(
  //     () => [
  //         {
  //             enableEditing: false,
  //             maxSize: 20,
  //             accessorKey: 'Actions',
  //             Cell: ({ row }) => (
  //                 <>
  //                     <IconButton color="error"
  //                         disabled={mode === "view"}
  //                         onClick={() => {
  //                             const rowId = row.original.id;
  //                             setModalRemainingAmount(modalRemainingAmount + parseInt(row.original.amount))
  //                             const updatedTheGLAccount = [...modalEntryCostCenter];
  //                             const updatedTheGLAccountWithoutRow = updatedTheGLAccount.filter((cost) => cost.id !== rowId);
  //                             setModalEntryCostCenter(updatedTheGLAccountWithoutRow);
  //                         }}
  //                     >
  //                         <DeleteIcon />
  //                     </IconButton>
  //                 </>
  //             )
  //         },
  //         {
  //             header: 'ID',
  //             accessorKey: 'costCenterNo',
  //             enableClickToCopy: true,
  //             enableEditing: false,
  //             sx: {
  //                 justifyContent: 'flex-start'
  //             }
  //         },
  //         {
  //             header: 'Name (Arabic)',
  //             accessorKey: 'nameAr',
  //             enableClickToCopy: true,
  //             enableEditing: false
  //         },
  //         {
  //             header: 'Name (English)',
  //             accessorKey: 'nameEn',
  //             enableClickToCopy: true,
  //             enableEditing: false
  //         },
  //         {
  //             header: 'Amount',
  //             accessorKey: 'amount',
  //             enableClickToCopy: true
  //         },
  //     ],
  //     [GLAccount, theGLAccount, theGLAccount?.costCenters, modalEntryCostCenter]
  // );

  // For cost center Auto complete
  const costCentersLookUp = useMemo(
    () => [
      {
        header: 'ID',
        accessorKey: 'costCenterNo',
        maxSize: 5
      },
      {
        header: 'Name(Arabic)',
        maxSize: 5,
        accessorKey: 'nameAr',
        sx: {
          justifyContent: 'flex-start'
        }
      },
      {
        header: 'Name(English)',
        maxSize: 5,
        accessorKey: 'nameEn'
      }
    ],
    []
  );

  const hideError = () => {
    setErrorMessage('');
  };

  // validation after refresh
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

  const FORM_VALIDATION = Yup.object().shape({
    description: Yup.string().required('Required'),
    reference: Yup.string().required('Required'),
    sourceType: Yup.string().required('Required'),
    entryTypeId: Yup.string().required('Required'),
    balanceTypeId: Yup.number().required('Required'),
    sourceApplication: Yup.string().required('Required')
  });

  const handleSaveRowEdits = ({ exitEditingMode, row, values }) => {
    const originalGLAccount = row.original;
    const updatedValues = values;
    setGLAccount((prevGLAccount) => {
      const updatedGLAccount = prevGLAccount.map((account) => {
        if (account.id === originalGLAccount.id) {
          account.amount = updatedValues.amount;
        }
        return account;
      });
      return updatedGLAccount;
    });
    exitEditingMode();
  };
  const handleSaveRowEditsCostCenters = ({ exitEditingMode, row, values }) => {
    if (theGLAccount && theGLAccount.costCenters) {
      const updatedTheGLAccount = { ...theGLAccount };
      const updatedCostCenters = [...updatedTheGLAccount.costCenters];
      const costCenterIndex = updatedCostCenters.findIndex(
        (center) => center.id === row.original.id
      );
      if (costCenterIndex !== -1) {
        updatedCostCenters[costCenterIndex].amount = values.amount;
        updatedTheGLAccount.costCenters = updatedCostCenters;
        const updatedGLAccount = GLAccount.map((account) => {
          if (account.id === updatedTheGLAccount.id) {
            return updatedTheGLAccount;
          }
          return account;
        });
        setTheGLAccount(updatedTheGLAccount);
        setGLAccount(updatedGLAccount);
        exitEditingMode();
      }
    }
  };
  const entryTypeId = {
    Normal: 1,
    Entered: 2,
    Generated: 3
  };
  const balanceTypeId = {
    Normal: 1,
    Begining: 2,
    Adjustement: 3,
    Closed: 4
  };
  const options = {
    actions: ['Save', 'Save & close', 'Save & new'],
    handler: handleSave
  };
  function handleSave(action) {
    submitFormBTN.current.click();
    setNavigationRoute(action === options.actions[1] ? 1 : action === options.actions[2] ? 2 : 0);
  }
  useEffect(() => {}, [theGLAccount]);
  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{
          ...initialValues
        }}
        validationSchema={FORM_VALIDATION}
        onSubmit={(values, actions) => SubmitAddForm(values, actions)}>
        {({ values, handleSubmit, setFieldValue, resetForm, dirty }) => (
          <>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                backgroundColor: (theme) => (theme.palette.mode == 'dark' ? '#000' : '#153d77')
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
                      ? 'Add Journal'
                      : mode === 'edit'
                      ? 'Edit Journal'
                      : 'View Journal'
                  }
                />
                <Box sx={{ marginY: 0, display: 'flex' }} zIndex={1000}>
                  {mode !== 'edit' ? (
                    <DropdownButton
                      disabled={mode !== 'view'}
                      options={{
                        actions: ['Edit'],
                        handler: function () {
                          navigate(`/general-ledger/transactions/journal/edit/${id}`, {
                            state: 'edit'
                          });
                        }
                      }}
                      iconName=""
                      buttonColor={''}
                      hoverText={'Edit Journal'}
                    />
                  ) : (
                    <DropdownButton
                      disabled={mode !== 'edit'}
                      options={{
                        actions: ['View'],
                        handler: function () {
                          navigate(`/general-ledger/transactions/journal/view/${id}`, {
                            state: 'view'
                          });
                        }
                      }}
                      iconName=""
                      buttonColor={''}
                      hoverText={'View Journal'}
                    />
                  )}

                  <DropdownButton
                    disabled={!dirty && mode === 'add'}
                    options={{
                      actions: ['New'],
                      handler: function () {
                        navigate('/general-ledger/transactions/journal/add', { state: 'add' });
                      }
                    }}
                    iconName="addCircle"
                    buttonColor={''}
                    hoverText={'Add New Journal'}
                  />
                  <DropdownButton
                    disabled={!firstDisabled || mode === 'add'}
                    options={{
                      actions: ['First'],
                      handler: function () {
                        let index = 0;
                        for (let i = 0; i < allJournals.length; i++) {
                          if (allJournals[i]['id'] == id) {
                            index = i;
                          }
                        }
                        if (index == 0) {
                          setFirstDisabled(false);
                        } else {
                          navigate(
                            `/general-ledger/transactions/journal/${
                              mode === 'edit' ? 'edit/' : ''
                            }${allJournals[0].id}`,
                            { state: `${mode}` }
                          );
                        }
                      }
                    }}
                    buttonColor={''}
                    hoverText={'Get First Journal'}
                  />
                  <DropdownButton
                    disabled={!prevDisabled || mode === 'add'}
                    options={{
                      actions: [],
                      handler: function () {
                        let index = 0;
                        for (let i = 0; i < allJournals.length; i++) {
                          if (allJournals[i]['id'] == id) {
                            index = i;
                          }
                        }
                        if (index == 0) {
                          setPrevDisabled(false);
                        } else {
                          navigate(
                            `/general-ledger/transactions/journal/${
                              mode === 'edit' ? 'edit/' : ''
                            }${mode === 'view' ? 'view/' : ''}${allJournals[index - 1].id}`,
                            { state: `${mode}` }
                          );
                        }
                      }
                    }}
                    iconName="ArrowBackIosIcon"
                    buttonColor={''}
                    hoverText={'Get Previos Journal'}
                  />
                  <DropdownButton
                    disabled={!nextDisabled || mode === 'add'}
                    options={{
                      actions: [],
                      handler: function () {
                        let index = 0;
                        for (let i = 0; i < allJournals.length; i++) {
                          if (allJournals[i]['id'] == id) {
                            index = i;
                          }
                        }
                        if (index == allJournals.length - 1) {
                          setNextDisabled(true);
                        } else {
                          navigate(
                            `/general-ledger/transactions/journal/${
                              mode === 'edit' ? 'edit/' : ''
                            }${mode === 'view' ? 'view/' : ''}${allJournals[index + 1].id}`,
                            { state: `${mode}` }
                          );
                        }
                      }
                    }}
                    iconName="ArrowForwardIosIcon"
                    buttonColor={''}
                    hoverText={'Get Next Journal'}
                  />
                  <DropdownButton
                    disabled={!lastDisabled || mode === 'add'}
                    options={{
                      actions: ['Last'],
                      handler: function () {
                        let index = 0;
                        for (let i = 0; i < allJournals.length; i++) {
                          if (allJournals[i]['id'] == id) {
                            index = i;
                          }
                        }
                        if (index == allJournals.length - 1) {
                          setFirstDisabled(false);
                        } else {
                          navigate(
                            `/general-ledger/transactions/journal/${
                              mode === 'edit' ? 'edit/' : ''
                            }${mode === 'view' ? 'view/' : ''}${
                              allJournals[allJournals.length - 1].id
                            }`,
                            { state: `${mode}` }
                          );
                        }
                      }
                    }}
                    buttonColor={''}
                    hoverText={'Get Last Journal'}
                  />
                  <DropdownButton
                    options={{
                      actions: ['Delete'],
                      handler: function () {
                        if (
                          !window.confirm('Are You Sure You Want To Delete This ' + data?.serialNo)
                        ) {
                          return;
                        }
                        DeleteJournal([id]).then((res) => {
                          navigate('/general-ledger/transactions/journal');
                        });
                      }
                    }}
                    iconName="delete"
                    buttonColor={'red'}
                    disabled={mode === 'add'}
                    hoverText={'Delete Journal'}
                  />
                  <DropdownButton
                    buttonName="Save"
                    options={options}
                    icon="save"
                    iconName="save"
                    hoverText={'Save Journal Options'}
                  />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Grid container alignItems="center" justifyContent="space-between" width="100%">
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
                <Section name={'Journal'}>
                  <ErrorMessageBox errorMessage={errorMessage} onClose={hideError} />
                  <Grid item xs={12} md={4} sx={{ padding: '10px' }}>
                    <Tfield id="ID" label="ID" value={data?.serialNo} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    {mode !== 'view' ? (
                      <Textfield
                        name="description"
                        label="Description"
                        placeholder="Enter Description"
                      />
                    ) : (
                      <Tfield id="description" label="description" value={data?.description} />
                    )}
                  </Grid>
                  <Grid item xs={12} md={4}>
                    {mode !== 'view' ? (
                      <Textfield name="reference" label="Reference" placeholder="Enter reference" />
                    ) : (
                      <Tfield id="reference" label="reference" value={data?.reference} />
                    )}
                  </Grid>
                  <Grid item xs={12} md={4}>
                    {mode !== 'view' ? (
                      <ComboBox
                        options={Object.keys(entryTypeId)}
                        name="entryTypeId"
                        onChange={(_, newValue) => {
                          setFieldValue('entryTypeId', entryTypeId[newValue]);
                        }}
                        values={getKeyByValue(entryTypeId, values.entryTypeId)}
                        label="Entry Type Id"
                      />
                    ) : (
                      <Tfield
                        id="entryTypeId"
                        label="entry Type"
                        value={
                          data?.entryTypeId == 1
                            ? 'normal'
                            : data?.entryTypeId == 2
                            ? 'Entered'
                            : data?.entryTypeId == 3
                            ? 'Generated'
                            : ''
                        }
                      />
                    )}
                    <ToastContainer />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    {mode !== 'view' ? (
                      <Textfield
                        name="sourceType"
                        label="Source Type"
                        placeholder="Enter source type"
                      />
                    ) : (
                      <Tfield id="sourceType" label="source Type" value={data?.sourceType} />
                    )}
                  </Grid>
                  <Grid item xs={12} md={4}>
                    {mode !== 'view' ? (
                      <ComboBox
                        options={Object.keys(balanceTypeId)}
                        name="balanceTypeId"
                        onChange={(_, newValue) => {
                          setFieldValue('balanceTypeId', balanceTypeId[newValue]);
                        }}
                        values={getKeyByValue(balanceTypeId, values.balanceTypeId)}
                        label="balance Type Id"
                      />
                    ) : (
                      <Tfield
                        id="balanceTypeId"
                        label="balance Type"
                        value={
                          data?.balanceTypeId == 1
                            ? 'Normal'
                            : data?.balanceTypeId == 2
                            ? 'Begining'
                            : data?.balanceTypeId == 3
                            ? 'Adjustment'
                            : data?.balanceTypeId == 4
                            ? 'Closed'
                            : ''
                        }
                      />
                    )}
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Tfield name="sourceApplication" label="Source Application" value={'GL'} />
                  </Grid>
                </Section>
                <Button ref={submitFormBTN} sx={{ display: 'none' }} type="submit" />
              </Form>
              <Modal
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
                        textAlign: 'center',
                        fontWeight: 'bold',
                        marginBottom: '10px',
                        fontFamily: 'Roboto'
                      }}
                      variant="h3">
                      Add Journal Entry Detail
                    </Typography>
                    <CloseIcon
                      onClick={() => {
                        setModalAmount('');
                        setModalEntryCostCenter([]);
                        setModalId('');
                        setModalRemainingAmount(0);
                        setCostCenterId('');
                        handleClose();
                      }}
                      sx={{ color: 'white', cursor: 'pointer' }}
                    />
                  </Box>
                  <Grid container sx={{ padding: '0 15px', justifyContent: 'space-between' }}>
                    <Grid item xs={12} md={4} sx={{ marginBottom: '10px', paddingRight: '10px' }}>
                      <CustomAutocomplete
                        data={allGLAccount}
                        columns={GLLookUp}
                        show="nameEn"
                        label="GLAccount"
                        onChange={async (e) => {
                          setCostCenters([]);
                          setModalId(e.id);
                          if (e.id) {
                            const glResponse = await GetGLById(e.id);
                            if (glResponse.data.accountNatureId === 1) {
                              setModalType('debit');
                            } else if (glResponse.data.accountNatureId === 2) {
                              setModalType('credit');
                            }
                            for (
                              let i = 0;
                              i < glResponse.data.glAccountCostCenterCategories.length;
                              i++
                            ) {
                              const costCenterCategoryResponse = await GetCostCenteCategoryById(
                                glResponse.data.glAccountCostCenterCategories[i]
                                  .costCenterCategoryId
                              );
                              let costt = costCenterCategoryResponse.data.costCenters;
                              let c = costt.filter((cost) => cost.isActive === true);
                              setCostCenters((prevCostCenters) => [...prevCostCenters, ...c]);
                            }
                          } else {
                            setModalType('type');
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ marginBottom: '10px', paddingRight: '10px' }}>
                      <Tfield key={modalType} label="Type" value={modalType ? modalType : 'Type'} />
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ marginBottom: '10px', paddingRight: '10px' }}>
                      <Textfield
                        name="descript"
                        label="Description"
                        placeholder="Enter Description"
                        onChange={(e) => {
                          setModalDescription(e.target.value);
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ marginBottom: '10px', paddingRight: '10px' }}>
                      <Textfield
                        name="amount"
                        label="Amount"
                        min={0}
                        type={'number'}
                        placeholder="Enter Amount"
                        onChange={(e) => {
                          setModalAmount(e.target.value);
                          setModalRemainingAmount(e.target.value);
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Tfield
                        key={modalRemainingAmount}
                        label="Remaining Amount"
                        value={modalRemainingAmount ? modalRemainingAmount : 0}
                      />
                    </Grid>
                  </Grid>
                  <Box
                    sx={{
                      flexWrap: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 15px'
                    }}>
                    {/* <Grid item xs={10} md={5} sx={{ width: '45%' }}>
                      <CustomAutocomplete
                        data={costCenters}
                        columns={costCentersLookUp}
                        show="nameEn"
                        label="Cost Center Name"
                        onChange={(e) => {
                          setCostCenterId(e.id);
                        }}
                      />
                    </Grid>
                    <Grid item xs={10} md={5} sx={{ marginLeft: '15px', width: '45%' }}>
                      <Textfield
                        name="costCenteramount"
                        disabled={!modalAmount}
                        label="Cost Center Amount"
                        min={0}
                        type={'number'}
                        placeholder={'Enter amount'}
                        onChange={(e) => {
                          setCostCenterAmount(e.target.value);
                        }}
                      />
                    </Grid>
                    <Grid item xs={2} md={1} sx={{ marginLeft: '15px', marginBottom: '15px' }}>
                      <DropdownButton
                        options={{
                          actions: ['Add'],
                          handler: function () {
                            setCostCenters([]);
                            if (!costCenterID) {
                              showToast('add Cost Center First', 2000, 'error');
                            } else if (
                              parseInt(costCenterAmount) > parseInt(modalRemainingAmount)
                            ) {
                              showToast('The Remaining Amount is not Enough', 2000, 'error');
                            } else {
                              getCostCenterById(costCenterID).then((res) => {
                                const center = {
                                  id: res.data.id,
                                  costCenterNo: res.data.costCenterNo,
                                  categoryId: res.data.costCenterCategoryId,
                                  nameAr: res.data.nameAr,
                                  nameEn: res.data.nameEn,
                                  amount: costCenterAmount
                                };
                                if (0) {
                                  showToast(
                                    'that cost center already exist under that GLAccount',
                                    2000,
                                    'error'
                                  );
                                } else {
                                  setModalEntryCostCenter([...modalEntryCostCenter, center]);
                                  setModalRemainingAmount(
                                    parseInt(modalRemainingAmount) - parseInt(costCenterAmount)
                                  );
                                }
                              });
                            }
                          }
                        }}
                        buttonColor={''}
                        height="50px"
                      />
                    </Grid> */}
                  </Box>
                  {/* <MaterialReactTable
                    pageCount={2}
                    rowCount={2}
                    muiTableHeadCellProps={{
                      sx: {
                        fontWeight: 'bold',
                        fontSize: '18px',
                        color: '#153d77',
                        backgroundColor: (theme) => theme.palette.mode == 'dark' && '#141619',
                        color: (theme) => theme.palette.mode == 'dark' && '#fff'
                      }
                    }}
                    muiTableBodyCellProps={{
                      sx: {
                        backgroundColor: (theme) => theme.palette.mode == 'dark' && '#141619',
                        color: (theme) => theme.palette.mode == 'dark' && '#fff'
                      }
                    }}
                    muiBottomToolbarProps={{
                      sx: {
                        backgroundColor: (theme) => theme.palette.mode == 'dark' && '#141619'
                      }
                    }}
                    muiTopToolbarProps={{
                      sx: {
                        backgroundColor: (theme) => theme.palette.mode == 'dark' && '#141619'
                      }
                    }}
                    muiTablePaginationProps={{
                      rowsPerPageOptions: [2, 2],
                      sx: {
                        color: (theme) => theme.palette.mode == 'dark' && '#fff'
                      }
                    }}
                    muiTableBodyProps={{
                      sx: (theme) => ({
                        '& tr:hover td': {
                          backgroundColor: (theme) => theme.palette.mode == 'dark' && '#4c3838'
                        }
                      })
                    }}
                    columns={colum}
                    data={modalEntryCostCenter}
                    filterFromLeafRows
                    initialState={{
                      expanded: true,
                      density: 'compact'
                    }}
                    paginateExpandedRows={false}
                    enableRowSelection
                    positionToolbarAlertBanner="bottom"
                    editingMode="row"
                    enableEditing
                    enableColumnOrdering
                    onEditingRowSave={handleSaveRowEditsCostCenters}
                  /> */}
                  <ValueTable
                    col={colum}
                    data={modalEntryCostCenter}
                    pageSize={3}
                    handleDelete={modalDeleteInRow}
                    handleAdd={modalAddInRow}
                    handleEdit={modalEditInRow}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                    <DropdownButton
                      options={{
                        actions: ['Add'],
                        handler: function () {
                          if (!modalId) {
                            showToast('Add GL Account first', 2000, 'error');
                          } else if (modalAmount <= 0) {
                            showToast('You must have a positive amount', 2000, 'error');
                          } else {
                            const isExistingGLAccount = GLAccount.some(
                              (account) => account.id === modalId
                            );
                            if (isExistingGLAccount) {
                              showToast('GL Account already exists', 2000, 'error');
                            } else {
                              GetGLById(modalId).then((res) => {
                                let GLAccountData = {
                                  id: modalId,
                                  type: modalType,
                                  nameEn: res.data.nameEn,
                                  nameAr: res.data.nameAr,
                                  amount: modalAmount,
                                  description: modalDescription,
                                  remainingAmount: modalRemainingAmount,
                                  accountNo: res.data.accountNo,
                                  costCenters: modalEntryCostCenter
                                };
                                setGLAccount([...GLAccount, GLAccountData]);
                                setModalAmount('');
                                setModalEntryCostCenter([]);
                                setModalId('');
                                setModalRemainingAmount(0);
                                setCostCenterId('');
                              });
                              handleClose();
                              showToast('GL Account Added Successfully', 2000, 'success');
                            }
                          }
                        }
                      }}
                      buttonColor={''}
                      height="50px"
                      hoverText={'Add Gl Account'}
                    />
                  </Box>
                </Box>
              </Modal>
              <Modal
                open={costCenterOpen}
                onClose={handleCostCenterClose}
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
                        textAlign: 'center',
                        fontWeight: 'bold',
                        marginBottom: '10px',
                        fontFamily: 'Roboto'
                      }}
                      variant="h3">
                      Edit Journal entry
                    </Typography>
                    <CloseIcon
                      onClick={handleCostCenterClose}
                      sx={{ color: 'white', cursor: 'pointer' }}
                    />
                  </Box>
                  <Grid
                    container
                    sx={{ padding: '15px 15px 30px', justifyContent: 'space-between' }}>
                    <Grid item xs={12} md={4} sx={{ padding: '10px' }}>
                      <Tfield id="type" label="GL Account Type" value={theGLAccount?.type} />
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ padding: '10px' }}>
                      <Tfield id="nameEn" label="Account" value={theGLAccount?.nameEn} />
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ padding: '10px' }}>
                      <Tfield id="nameAr" label="Description" value={theGLAccount?.description} />
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ padding: '10px' }}>
                      <Tfield id="id" label="Id" value={theGLAccount?.accountNo} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Tfield
                        key={theGLAccount?.remainingAmount}
                        label="Remaining Amount"
                        value={theGLAccount?.remainingAmount}
                      />
                      {/* <span style={{ marginLeft: "12px", marginTop: "8px", display: "inline-block", border: "1px solid #e0e0e0", padding: "18px 218px 18px 15px", borderRadius: "4px" }}><span style={{ fontSize: "15px", marginRight: "20px", fontWeight: "bold", color: "black" }}>Remaining Amount  :</span><span style={{ fontSize: "15px", fontWeight: "bold", color: "black" }}>{theGLAccount?.remainingAmount}</span></span> */}
                    </Grid>
                  </Grid>

                  {/* <MaterialReactTable
                    pageCount={2}
                    rowCount={2}
                    muiTableHeadCellProps={{
                      sx: {
                        fontWeight: 'bold',
                        fontSize: '18px',
                        color: '#153d77',
                        backgroundColor: (theme) => theme.palette.mode == 'dark' && '#141619',
                        color: (theme) => theme.palette.mode == 'dark' && '#fff'
                      }
                    }}
                    muiTableBodyCellProps={{
                      sx: {
                        backgroundColor: (theme) => theme.palette.mode == 'dark' && '#141619',
                        color: (theme) => theme.palette.mode == 'dark' && '#fff'
                      }
                    }}
                    muiBottomToolbarProps={{
                      sx: {
                        backgroundColor: (theme) => theme.palette.mode == 'dark' && '#141619'
                      }
                    }}
                    muiTopToolbarProps={{
                      sx: {
                        backgroundColor: (theme) => theme.palette.mode == 'dark' && '#141619'
                      }
                    }}
                    muiTablePaginationProps={{
                      rowsPerPageOptions: [2, 2],
                      sx: {
                        color: (theme) => theme.palette.mode == 'dark' && '#fff'
                      }
                    }}
                    muiTableBodyProps={{
                      sx: (theme) => ({
                        '& tr:hover td': {
                          backgroundColor: (theme) => theme.palette.mode == 'dark' && '#4c3838'
                        }
                      })
                    }}
                    columns={column}
                    data={theGLAccount?.costCenters}
                    filterFromLeafRows
                    initialState={{
                      expanded: true,
                      density: 'compact'
                    }}
                    paginateExpandedRows={false}
                    enableRowSelection
                    positionToolbarAlertBanner="bottom"
                    editingMode="row"
                    enableEditing
                    enableColumnOrdering
                    onEditingRowSave={handleSaveRowEditsCostCenters}
                  /> */}
                  <ValueTable
                    col={colum}
                    data={theGLAccount?.costCenters}
                    pageSize={3}
                    handleDelete={mode !== 'view' ? editModalDeleteInRow : ''}
                    handleAdd={mode !== 'view' ? editModalAddInRow : ''}
                  />
                </Box>
              </Modal>
            </Box>
            <Section name={'Journal Entries Details'}>
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
                                        <Grid item xs={12} md={4} sx={{ marginBottom: "10px" }}>
                                            <CustomAutocomplete key={autocompleteKey} data={allGLAccount} columns={GLLookUp} show="nameEn" label="GLAccount" onChange={(e) => {
                                                setModalId(e.id)
                                                if (e.id) {
                                                    GetGLById(e.id).then((res) => {
                                                        if (res.data.accountNatureId == 1) {
                                                            setModalType("debit")
                                                        }
                                                        else if (res.data.accountNatureId == 2) {
                                                            setModalType("credit")
                                                        }
                                                    })
                                                }
                                                else {
                                                    setModalType("type")
                                                }
                                            }} />
                                        </Grid>
                                        <Grid item xs={12} md={2} sx={{ marginBottom: "10px" }}>
                                            <Textfield key={autocompleteKey} name="amount" value={modalAmount}
                                                label="Amount" min={0} type={"number"} placeholder="Enter Amount" onChange={(e) => {
                                                    setModalAmount(e.target.value)
                                                    setModalRemainingAmount(e.target.value)
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={2} sx={{ marginBottom: "10px" }}>
                                            <Tfield key={modalType} label="Type" value={modalType ? modalType : "Type"} />
                                        </Grid>
                                        <Grid item xs={12} md={2.7} sx={{ marginBottom: "10px" }}>
                                            <Textfield key={autocompleteKey} name="descr" value={modalDescription} label="Description" placeholder="Enter Description" onChange={(e) => {
                                                setModalDescription(e.target.value)
                                            }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={1} sx={{ marginBottom: "10px" }}>
                                            <Button
                                                onClick={() => {
                                                    if (!modalId) {
                                                        showToast("Add GL Account first", 2000, "error");
                                                    } else if (modalAmount <= 0) {
                                                        showToast("You must have a positive amount", 2000, "error");
                                                    } else {
                                                        const isExistingGLAccount = GLAccount.some(account => account.id === modalId);

                                                        if (isExistingGLAccount) {
                                                            showToast("GL Account already exists", 2000, "error");
                                                        } else {
                                                            GetGLById(modalId).then((res) => {
                                                                let GLAccountData = {
                                                                    id: modalId,
                                                                    type: modalType,
                                                                    nameEn: res.data.nameEn,
                                                                    nameAr: res.data.nameAr,
                                                                    amount: modalAmount,
                                                                    description: modalDescription,
                                                                    remainingAmount: modalRemainingAmount,
                                                                    accountNo: res.data.accountNo,
                                                                    costCenters: [],
                                                                };
                                                                setGLAccount([...GLAccount, GLAccountData]);
                                                                setModalAmount("");
                                                                setModalEntryCostCenter([])
                                                                setModalId("");
                                                                setModalRemainingAmount(0)
                                                                setModalDescription("")
                                                                setCostCenterId("")
                                                                setModalType("Type")
                                                                setRerenderAutocomplete(!rerenderAutocomplete);
                                                                setAutocompleteKey(autocompleteKey + 1);
                                                            });
                                                            showToast("GL Account Added Successfully", 2000, "success");
                                                        }
                                                    }
                                                }}
                                                sx={{

                                                    padding: "11px 32px",
                                                    marginBottom: "25px"
                                                }}
                                                variant="contained">Add</Button>
                                        </Grid>
                                    </AddInRow>
                                } */}
                {mode !== 'view' && (
                  // <Button
                  //   onClick={() => {
                  //     handleOpen();
                  //     setCostCenters([]);
                  //   }}
                  //   size="large"
                  //   sx={{
                  //     padding: '11px 32px',
                  //     marginBottom: '45px'
                  //   }}
                  //   color="primary"
                  //   variant="contained">
                  //   New
                  // </Button>
                  <Box sx={{ marginBottom: '30px' }}>
                    {/* Other components inside the box */}
                    <DropdownButton
                      options={{
                        actions: ['New'],
                        handler: function () {
                          handleOpen();
                          setCostCenters([]);
                        }
                      }}
                      iconName=""
                      buttonColor={''}
                      hoverText={'Add New Journal Entry Detail  '}
                    />
                  </Box>
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
                                    data={GLAccount}
                                    filterFromLeafRows
                                    initialState={{
                                        expanded: true,
                                        density: 'compact'
                                    }}
                                    paginateExpandedRows={false}
                                    enableRowSelection
                                    onRowSelectionChange={() => {
                                        console.log("hello")
                                    }}
                                    positionToolbarAlertBanner="bottom"
                                    //Edite
                                    editingMode="row"
                                    enableEditing
                                    enableColumnOrdering
                                    onEditingRowSave={handleSaveRowEdits}
                                /> */}
                <ValueTable
                  col={columns}
                  data={GLAccount}
                  handleRowClick={onRowClick}
                  handleDelete={mode !== 'view' ? deleteInRow : ''}
                  handleAdd={mode !== 'view' ? AddInRow : ''}
                  handleEdit={mode !== 'view' ? EditInRow : ''}
                />
              </Box>
            </Section>
            <Section name={'Date'}>
              <Grid item xs={12} md={6}>
                {mode !== 'add' ? (
                  <Tfield
                    id="serialNo"
                    label="Date"
                    value={moment(data?.creationTime)
                      .format('MMMM D, YYYY  : HH:mm')
                      .substring(
                        0,
                        moment(data?.creationTime).format('MMMM D, YYYY  : HH:mm').indexOf(':')
                      )}
                  />
                ) : (
                  <Tfield id="serialNo" label="Date" />
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                {mode !== 'add' ? (
                  <Tfield
                    id="serialNo"
                    label="Time"
                    value={moment(
                      moment(data?.creationTime)
                        .format('MMMM D, YYYY  : HH:mm')
                        .substring(
                          moment(data?.creationTime).format('MMMM D, YYYY  : HH:mm').indexOf(':') +
                            1,
                          moment(data?.creationTime).format('MMMM D, YYYY  : HH:mm').length
                        ),
                      'HH:mm'
                    ).format('h:mm a')}
                  />
                ) : (
                  <Tfield id="serialNo" label="Time" />
                )}
              </Grid>
            </Section>
          </>
        )}
      </Formik>
    </>
  );
};
