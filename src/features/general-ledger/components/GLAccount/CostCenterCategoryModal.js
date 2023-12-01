import React, { useEffect, useState } from 'react';
import { Drawer, Space } from 'antd';
import { TextField } from '@mui/material';
import * as Yup from 'yup';
import { Formik, Form, useFormikContext } from 'formik';
import { Button, Grid, Box, Typography } from '@mui/material';
import { Section } from '../../../../components/FormsUI/Section';
import ErrorMessageBox from '../../../../components/errorMsgBox/ErrorMessageBox ';
import CustomAutocomplete from '../../../../components/customAutoComplete/CustomAutoComplete';
import Textfield from '../../../../components/FormsUI/Textfield';
import { useMemo } from 'react';
import CustomSwitch from '../../../../components/FormsUI/switch/switch';
import ValueTable from '../../../../components/ValueTable/ValueTable';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import showToast from '../../../../utils/toastMessage';
import { getAllLookup } from '../../api/costCenter';
import { add } from '../../api/CostCenterCategory';
import { GetById as getCostCenterById } from '../../api/costCenter';
import { GetById } from '../../api/CostCenterCategory';
import AntModal from '../CostCenter/AntModal';
import DropdownButton from '../../../../components/DropdownButton/DropDownButton';

function CostCenterCategoryModal({ open: op, handleClose: close }) {
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [tableCostCenters, setTableCostCenters] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [costCenterLookUp, setCostCenterLookUp] = useState([]);
  const [initialValues, setInitialValues] = useState({
    nameAr: '',
    nameEn: '',
    isActive: false
  });
  const handleClose = (x) => {
    close(x);
  };
  const handleShow = () => {
    setShow(true);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const handleOff = (x) => {
    setOpen(false);
    if (x) {
      setTableCostCenters([...tableCostCenters, x]);
    }
  };

  useEffect(() => {
    getAllLookup().then((res) => {
      setCostCenterLookUp(res);
    });
  }, []);

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
        });
        console.log(newData);
        resolve();
      }, 0);
    });

  const FORM_VALIDATION = Yup.object().shape({
    nameAr: Yup.string().required('Required'),
    nameEn: Yup.string().required('Required')
  });

  const hideError = () => {
    setErrorMessage('');
  };

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

  const SubmitAddForm = async (values, actions) => {
    values.costCenters = tableCostCenters;
    console.log(values);
    add(values)
      .then((res) => {
        showToast('Successfully Added!!', 2000, 'success');
        console.log(res);
        GetById(res.data).then((result) => {
          handleClose(result.data);
        });
      })
      .catch((error) => {
        showToast(`${error.response.data.Message}`, 2000, 'error');
        setErrorMessage(error.response.data.Message);
        console.log(error);
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        ...initialValues
      }}
      validationSchema={FORM_VALIDATION}
      onSubmit={(values, actions) => SubmitAddForm(values, actions)}>
      {({ values, handleSubmit, setFieldValue, resetForm, dirty }) => (
        <Drawer
          title={'Cost Center Category'}
          placement="right"
          width={900}
          onClose={() => handleClose()}
          open={op}
          extra={
            <Space>
              <DropdownButton
                options={{
                  actions: ['Cancel'],
                  handler: function () {
                    handleClose();
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
                    SubmitAddForm(values);
                  }
                }}
                iconName=""
                buttonColor={''}
                hoverText={'Save'}
              />
            </Space>
          }>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#000' : '#153d77')
            }}>
            <ToastContainer />
            <Form>
              <Section name={'Cost Centers Category'}>
                <ErrorMessageBox errorMessage={errorMessage} onClose={hideError} />
                <Grid item xs={12} md={6}>
                  <Textfield name="nameAr" label="Name(Arabic)" placeholder="Enter Arabic name" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Textfield name="nameEn" label="Name(English)" placeholder="Enter English name" />
                </Grid>
                <Grid item xs={6}>
                  <CustomSwitch
                    onChange={(newValue) => setFieldValue('isActive', newValue)}
                    labelOn="Active"
                    labelOff="Active"
                  />
                </Grid>
              </Section>
            </Form>
          </Box>
          <AntModal open={open} handleClose={(x) => handleOff(x)} />
          <Section name={'Cost Centers'}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
              <Button
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
        </Drawer>
      )}
    </Formik>
  );
}

export default CostCenterCategoryModal;
