import React, { useEffect, useState } from 'react';
import { Drawer, Space } from 'antd';
import { Button, Grid, Box, Typography } from '@mui/material';
import Textfield from '../../../../components/FormsUI/Textfield';
import * as Yup from 'yup';
import { addCostCenter, getAllCategory, GetById, getAllLookup } from '../../api/costCenter';
import { Formik, Form } from 'formik';
import { Section } from '../../../../components/FormsUI/Section';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomSwitch from '../../../../components/FormsUI/switch/switch';
import showToast from '../../../../utils/toastMessage';
import { useMemo } from 'react';
import ErrorMessageBox from '../../../../components/errorMsgBox/ErrorMessageBox ';
import CustomAutocomplete from '../../../../components/customAutoComplete/CustomAutoComplete';
import ValueTable from '../../../../components/ValueTable/ValueTable';
import DropdownButton from '../../../../components/DropdownButton/DropDownButton';

function AntModal({ open: op, handleClose: close }) {
  console.log('sss', op);
  const [errorMessage, setErrorMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [costCenterLookUp, setCostCenterLookUp] = useState([]);
  const [tableCostCenters, setTableCostCenters] = useState([]);
  const [modals, setModals] = useState([{ id: 1, show: op, formData: '' }]);
  const [initialValues, setInitialValues] = useState({
    costCenterNo: '',
    nameAr: '',
    nameEn: '',
    isActive: true,
    costCenterCategoryId: '',
    parentCostCenterId: null
  });

  const handleClose = (modalId, x) => {
    if (modalId == 1) {
      close(x);
      setModals([{ id: 1, show: op, formData: '' }]);
    }
    setModals((prevModals) =>
      prevModals.map((modal) => (modal.id === modalId ? { ...modal, show: false } : modal))
    );
    setTableCostCenters([]);
  };

  const handleShow = (modalId) => {
    const newModal = { id: modals.length + 1, show: true, formData: '' };
    setModals([...modals, newModal]);
    setTableCostCenters([]);
  };

  useEffect(() => {
    getAllCategory().then((data) => setCategories(data));
    getAllLookup().then((res) => {
      setCostCenterLookUp(res);
    });
  }, []);

  const hideError = () => {
    setErrorMessage('');
  };

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
        GetById(newData.costCenterNo.id).then((res) => {
          console.log(res);
          setTableCostCenters([...tableCostCenters, res.data]);
        });

        resolve();
      }, 10);
    });

  const EditInRow = async (newData, oldData) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        GetById(newData.costCenterNo.id).then((res) => {
          console.log(res);

          setTableCostCenters([...tableCostCenters, res.data]);
          setTableCostCenters((costs) => costs.filter((cost) => cost.id !== newData.id));
        });
        console.log(newData);
        resolve();
      }, 0);
    });

  const SubmitAddForm = async (values, id) => {
    try {
      // values.isActive = isActiv

      // const newArray = tableCostCenters.map((item) => item.obj);
      console.log(tableCostCenters);
      values.costCenters = tableCostCenters;
      console.log(values);
      addCostCenter(values)
        .then((res) => {
          console.log(res);
          GetById(res.data).then((result) => {
            console.log(result);
            if (id === 1) {
              handleClose(id, result.data);
              showToast('Successfully Added!!', 2000, 'success');
            } else {
              handleClose(id);
              showToast('Successfully Added!!', 2000, 'success');
            }
            setTableCostCenters([result.data]);
          });
        })
        .catch((error) => {
          if (error.response.data.errors) {
            const err = Object.keys(error.response.data.errors)[0];
            showToast(`${error.response.data.errors[`${err}`]}`, 2000, 'error');
          } else {
            showToast(`${error.response.data.Message}`, 2000, 'error');
          }
        });
    } catch (error) {
      const err = Object.keys(error.response.data.errors)[0];
      showToast(`${error.response.data.errors[`${err}`]}`, 2000, 'error');
      setErrorMessage(error.response.data.errors[`${err}`]);
    }
  };

  useEffect(() => {
    setModals((prevModals) =>
      prevModals.map((modal) => (modal.id === 1 ? { ...modal, show: op } : modal))
    );
  }, [op]);

  const FORM_VALIDATION = Yup.object().shape({
    nameAr: Yup.string().required('Required'),
    nameEn: Yup.string().required('Required'),
    costCenterCategoryId: Yup.string().required('Required')
  });

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
  return (
    <>
      {modals.map((modal) => (
        <Formik
          enableReinitialize
          initialValues={{
            ...initialValues
          }}
          validationSchema={FORM_VALIDATION}
          onSubmit={(values, actions) => SubmitAddForm(values, actions)}>
          {({ values, handleSubmit, setFieldValue, resetForm, errors, touched, dirty }) => (
            <Drawer
              title={"Child Cost Center"}
              placement="right"
              width={900}
              onClose={() => handleClose(modal.id)}
              open={modal.show}
              extra={
                <Space>
                  <DropdownButton
                    options={{
                      actions: ['Cancel'],
                      handler: function () {
                        handleClose(modal.id);
                      }
                    }}
                    iconName=""
                    buttonColor={''}
                    hoverText={'Close'}
                  />
                  <DropdownButton
                    options={{
                      actions: ['Save'],
                      handler: function () {
                        SubmitAddForm(values, modal.id);
                      }
                    }}
                    iconName=""
                    buttonColor={''}
                    hoverText={'Save'}
                  />
                </Space>
              }>
              <Box>
                <Section name={'Cost Centers'}>
                  <ErrorMessageBox errorMessage={errorMessage} onClose={hideError} />
                  <ToastContainer />
                  <Grid item xs={12} md={4}>
                    <Textfield name="costCenterNo" label="ID" placeholder="Enter ID" />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Textfield name="nameAr" label="Arabic Name" placeholder="Enter Arabic name" />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Textfield
                      name="nameEn"
                      label="English Name"
                      placeholder="Enter English name"
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <CustomAutocomplete
                      data={categories}
                      columns={columnss}
                      value={values?.costCenterCategoryId}
                      show="nameEn"
                      label="Cost Center Categories"
                      onChange={(e) => {
                        setFieldValue('costCenterCategoryId', e.id);
                        console.log(tableCostCenters);
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
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
                  </Grid>

                  <Grid item xs={4}>
                    <CustomSwitch
                      onChange={(newValue) => setFieldValue('isActive', !newValue)}
                      labelOn="InActive"
                      labelOff="InActive"
                      label="Is Active"
                    />
                  </Grid>
                </Section>
                <Section name={'Child Cost Centers'}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      width: '100%',
                      alignItems: 'center'
                    }}>
                    <Button
                      onClick={() => handleShow(modal.id)}
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
                  </Box>
                  <Box sx={{ width: '100%' }}>
                    <ValueTable
                      col={columns}
                      data={tableCostCenters}
                      handleDelete={deleteInRow}
                      handleRowClick={onRowClick}
                      handleAdd={AddInRow}
                      handleEdit={EditInRow}
                    />
                  </Box>
                </Section>
              </Box>
            </Drawer>
          )}
        </Formik>
      ))}
    </>
  );
}

export default AntModal;
