import { useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import React, { useCallback, useState, useEffect } from 'react';
import { Button, IconButton, Box, Grid, Typography } from '@mui/material';
import DropdownButton from '../../../../components/DropdownButton/DropDownButton';
import { styled } from '@mui/material/styles';
import { ExportToCsv } from 'export-to-csv';
import { useRef } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ExcelExport } from './ExcelExport';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  getAll,
  DeleteCostCenterCategory,
  Update,
  GetById,
  add
} from '../../api/CostCenterCategory';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete,
  Edit,
  FileDownload as FileDownloadIcon
} from '@mui/icons-material';
import PathBreadcrumbs from '../../../../components/FormsUI/PathBreadcrumbs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import showToast from '../../../../utils/toastMessage';
import { useSelector } from 'react-redux';
import PageTitle from '../../../../components/pageTitle/PageTitle';
import LoadingWrapper from '../../../../components/Loading';
import ErrorWrapper from '../../../../components/Error';
import ValueTable from '../../../../components/ValueTable/ValueTable';

export const List = () => {
  const exportSelectedButtonRef = useRef(null);
  const [tableData, setTableData] = useState([]);

  //Fetch Data from BackEnd and change structure
  const {
    isLoading,
    error,
    data: result
  } = useQuery({
    queryKey: ['CostCenterCategory'],
    queryFn: getAll,
    onSuccess: (result) => {
      setTableData(result);
    }
  });

  //Delete Api
  const deleteRowQuery = useMutation({
    mutationFn: DeleteCostCenterCategory,
    onSuccess: (result) => {
      setTableData(result['data']['results']);
    }
  });

  const columns = [
    { title: 'Name(Arabic)', field: 'nameAr' },
    { title: 'Name(English)', field: 'nameEn' }
  ];
  const deleteInRow = (oldData) =>
    new Promise(async (resolve, reject) => {
      console.log(oldData);
      if (window.confirm(`Are you sure you want to delete item with Name: ${oldData.nameEn}?`)) {
        try {
          const response = await DeleteCostCenterCategory(oldData.id);
          if (response.status === 200) {
            // Delete was successful

            // Fetch updated data
            const updatedData = await getAll();
            setTableData(updatedData);

            // Trigger mutation (if needed)
            deleteRowQuery.mutate(oldData.id);

            // Remove the deleted item from the local state (if applicable)
            const updatedTableData = tableData.filter((item) => item.id !== oldData.id);
            setTableData(updatedTableData);

            showToast('Successfully Deleted!', 2000, 'success');
            resolve();
          }
        } catch (error) {
          showToast(error.response.data.Message, 2500, 'error');
          console.log(error);
          reject();
        }
      }
    });

  const EditInRow = (newData, oldData) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log(newData.id);
        GetById(newData.id).then((res) => {
          console.log(res);
          Update({
            id: newData.id,
            data: {
              nameAr: newData.nameAr,
              nameEn: newData.nameEn,
              isActive: res.data.isActive,
              costCenters: [...res.data.costCenters]
            }
          })
            .then((res) => {
              console.log(res);
              getAll().then((result) => {
                setTableData(result);
                showToast(`Edited Successfully`, 2000, 'success');
              });
            })
            .catch((error) => {
              if (error.response.data.errors) {
                const err = Object.keys(error.response.data.errors)[0];
                showToast(`${error.response.data.errors[`${err}`]}`, 2000, 'error');
              } else {
                showToast(error.response.data.Message, 2000, 'error');
              }
            });
        });
        resolve();
      }, 0);
    });

  const onRowClick = (e, rowData) => {
    navigate(rowData.id, { state: 'view' });
  };

  const editInPage = (e, rowData) => {
    navigate(rowData.id, { state: 'edit' });
  };

  const AddInRow = (newData) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        add({
          nameAr: newData.nameAr,
          nameEn: newData.nameEn,
          isActive: true,
          costCenters: []
        }).then((res) => {
          getAll().then((result) => {
            setTableData(result);
            showToast(`Added Successfully`, 2000, 'success');
          });
        }).catch((error)=>{
          if (error.response.data.errors) {
            const err = Object.keys(error.response.data.errors)[0];
            showToast(`${error.response.data.errors[`${err}`]}`, 2000, 'error');
          } else {
            showToast(error.response.data.Message, 2000, 'error');
          }
        })

        resolve();
      }, 0);
    });
  const navigate = useNavigate();

  //Handel Export Excel Functionality

  const handleExportExcel = () => {
    showToast('Successfully Excel File Export!', 2000, 'success');

    ExcelExport({ data: flattenedData });
  };
  const handleCsv = () => {
    showToast('Successfully CSV File Export!', 2000, 'success');

    handleExportData();
  };
  const handleSaveSelectedCsv = () => {
    if (exportSelectedButtonRef.current) {
      showToast('Successfully Selected CSV File Export!', 2000, 'success');

      exportSelectedButtonRef.current.click();
    }
  };

  //---------------------------------------------------------------------------------------------------------------------------------
  // PDF Functionality
  const handlePdf = () => {
    const doc = new jsPDF();
    doc.addFont('amiriri-regular.ttf', 'amiriri', 'normal');
    doc.setFont('amiriri');
    doc.setFontSize(64);

    const columnsForPdf = columns.map((col) => col.header);

    const dataForPdf = tableData.map((row) =>
      columns.map((col) => {
        const accessorKeys = col.accessorKey.split('.');
        let value = row;
        for (const key of accessorKeys) {
          value = value[key];
        }
        return value;
      })
    );

    doc.autoTable({
      head: [columnsForPdf],
      body: dataForPdf
    });

    if (doc.save('Cost Cenetrs Categories.pdf')) {
      showToast('Successfully PDF File Export!', 2000, 'success');
    }
  };

  //---------------------------------------------------------------------------------------------------------------------------------

  const DeleteCategory = useCallback(
    async (itemId) => {
      if (!window.confirm(`Are you sure you want to delete item with ID: ${itemId}? `)) {
        return;
      }

      try {
        await deleteRowQuery.mutateAsync(itemId).then((res) => {});
      } catch (error) {}
    },
    [deleteRowQuery]
  );

  //Edite in Place
  const editeCostcenter = async ({ exitEditingMode, row, values }) => {
    const { actions, 'item.nameAr': nameAr, 'item.nameEn': nameEn, ...dataToSend } = values;

    const newData = {
      nameAr,
      nameEn
    };

    exitEditingMode();
  };

  //---------------------------------------------------------------------------------------------------------------------------------

  const staticHeaders = ['Node Degree', 'Arbic Name', 'English Name'];
  //CSV Exports Functionality
  // const csvOptions = {
  //   fieldSeparator: ',',
  //   quoteStrings: '"',
  //   decimalSeparator: '.',
  //   showLabels: true,
  //   useBom: true,
  //   useKeysAsHeaders: false,
  //   headers: staticHeaders
  // };
  // const csvExporter = new ExportToCsv(csvOptions);

  //-----------------------------------------------------------------------------------------------------

  //Function to map all tree as flat data
  // const generateFlattenedData = (row, depth, parentIndex) => {
  //   const newItem = {
  //     id: depth,
  //     nameAr: row.item.nameAr,
  //     nameEn: row.item.nameEn,
  //     parent: parentIndex
  //   };
  //   return newItem;
  // };

  //Export Only Selected data as csv
  // const handleExportRows = (rows) => {
  //   const flattenedData = [];
  //   for (const row of rows) {
  //     if (typeof row.original === 'object') {
  //       flattenedData.push(generateFlattenedData(row.original, row.depth, null));

  //       if (row.original.subRows && row.original.subRows.length > 0) {
  //         for (const subRow of row.original.subRows) {
  //           flattenedData.push(generateFlattenedData(subRow, row.depth, row.depth));
  //         }
  //       }
  //     }
  //   }
  //   csvExporter.generateCsv(flattenedData);
  // };

  // //Export All data as csv
  // const handleExportData = () => {
  //   const flattenedData = [];
  //   const flattenObject = (item, depth = 0, parentIndex = null) => {
  //     flattenedData.push(generateFlattenedData(item, depth, parentIndex));
  //     const currentItemIndex = flattenedData.length - 1;
  //     if (item.subRows && item.subRows.length > 0) {
  //       for (const subItem of item.subRows) {
  //         flattenObject(subItem, depth + 1, currentItemIndex);
  //       }
  //     }
  //   };
  //   for (const item of tableData) {
  //     flattenObject(item);
  //   }
  //   csvExporter.generateCsv(flattenedData);
  // };

  //---------------------------------------------------------------------------------------------------------------------------------

  const options = {
    actions: ['PDF', 'Excel', 'CSV', 'Selected CSV'],
    handler: handleSave
  };

  function handleSave(action) {
    switch (action) {
      case 'PDF':
        handlePdf();
        break;

      case 'Excel':
        handleExportExcel();
        break;

      case 'CSV':
        handleCsv();
        break;

      case 'Selected CSV':
        handleSaveSelectedCsv();
        break;

      default:
        break;
    }
  }

  const { isOpen, drawerWidth } = useSelector((state) => state.sidebar);

  return (
    <Box>
      {isLoading ? (
        <LoadingWrapper />
      ) : error ? (
        <ErrorWrapper />
      ) : (
        result && (
          <Box
            sx={{
              backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#000' : '#153d77')
            }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginLeft: '20px',
                mb: '15px',
                alignItems: 'center',
                '@media (max-width: 600px)': {
                  flexDirection: isOpen ? 'column' : 'row'
                }
              }}>
              <PageTitle text="Cost Center Categories" />

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginRight: '20px'
                }}>
                <Grid container alignItems="center" justifyContent="space-between">
                  <Grid item></Grid>
                </Grid>

                <DropdownButton
                  disabled={false}
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
                  hoverText={'Add New Cost Center Category'}
                />

                {/* <DropdownButton buttonName="Export" options={options} iconName="export" /> */}
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                '@media (max-width: 600px)': {
                  flexDirection: isOpen ? 'column' : 'row'
                }
              }}>
              <PathBreadcrumbs crumbs={location.pathname.substring(1).split('/')} />
            </Box>

            <ToastContainer />
            <ValueTable
              col={columns}
              data={tableData}
              handleDelete={deleteInRow}
              handleEdit={EditInRow}
              handleRowClick={onRowClick}
              handleAdd={AddInRow}
              editInPage={editInPage}
            />
          </Box>
        )
      )}
    </Box>
  );
};
