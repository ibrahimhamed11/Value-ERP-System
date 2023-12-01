import { Button, Grid, styled, Box, Typography, Autocomplete, TextField, IconButton } from "@mui/material";
import { useMutation, useQuery } from '@tanstack/react-query';;
import { addUser, GetById, GetByIdRole, updateUser, getAllNum, DeleteUser, addUserBranches, getUserBranches, addUserRule } from "../api/users";
import PathBreadcrumbs from "../../../../components/FormsUI/PathBreadcrumbs";
import { Formik, Form, useFormikContext, Field, useField } from 'formik';
import Textfield from '../../../../components/FormsUI/Textfield';
import { AddCircle } from '@mui/icons-material';
import { Section } from "../../../../components/FormsUI/Section";
import * as Yup from 'yup';
import { useEffect, useMemo, useRef, useState } from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import MaterialReactTable from "material-react-table";
import { RoleUi } from "./RoleUi";
import { BranchUi } from "./BranchUi";
import { GeneralButton } from "../../../../components/DropdownButton/GenralButtons";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DropdownButton from "../../../../components/DropdownButton/DropDownButton";
import showToast from '../../../../utils/toastMessage';
import { ToastContainer } from 'react-toastify';
import ErrorMessageBox from '../../../../components/errorMsgBox/ErrorMessageBox ';
import { Edit as EditIcon, Delete as DeleteIcon, AddBox as AddBoxIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import Tfield from '../../../../components/ViewUI/Textfield';
import PageTitle from "../../../../components/pageTitle/PageTitle";
import ValueTable from "../../../../components/ValueTable/ValueTable";
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

export const User = () => {
    const [value, setValue] = useState(0);
    const { state: mode } = useLocation();
    const [pageCount, setPageCount] = useState(1)
    const [allUsers, setALlUsers] = useState([])
    console.log(mode)
    const navigate = useNavigate()
    const { id: userId } = useParams();
    const [roles, setRoles] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [branches, setBracnches] = useState([]);
    const [nextDisabled, setNextDisabled] = useState(true)
    const [prevDisabled, setPrevDisabled] = useState(true)
    const [firstDisabled, setFirstDisabled] = useState(true)
    const [lastDisabled, setLastDisabled] = useState(true)
    const [navigationRoute, setNavigationRoute] = useState(0);
    const [initialValues, setInitialValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
    });
    const submitFormBTN = useRef(null);
    const options = {
        actions: ['Save', 'Save & close', 'Save & new'],
        handler: handleSave
    };
    const pages = [
        "Company", 'CompanyBranch', "Journal", "CostCenter", "Role", "User", 'CostCenterCategory', 'Permission', 'GLAccount'
    ]


    const {
        isLoading,
        error,
        data: user,
    } = useQuery({
        queryKey: ['User', userId],
        refetchOnWindowFocus: false,
        queryFn: async () => {
            const res = await GetById(userId);
            return res;
        },
        onSuccess: (res) => {
            console.log(res.data);
            // setData(res.data);
            //   setFirstName(res.data.firstName)
            //   setLastName(res.data.lastName)
            //   setEmail(res.data.email)
            setInitialValues({
                firstName: res.data.firstName,
                lastName: res.data.lastName,
                email: res.data.email,
            });
        }
    });
    const {
        data,
    } = useQuery({
        queryKey: ['UserRole', userId],
        refetchOnWindowFocus: false,
        queryFn: async () => {
            const res = await GetByIdRole(userId);
            return res;
        },
        onSuccess: (res) => {
            console.log('er', res)
            setRoles([...res.data])

        }
    })
    const { data: DataBranch } = useQuery({
        queryKey: ['branch', userId],
        refetchOnWindowFocus: false,
        queryFn: async () => {
            const res = await getUserBranches(userId);
            return res;
        },
        onSuccess: (res) => {

            console.log("first", res?.data[0].companyBranches)
            setBracnches([...res?.data[0].companyBranches])

        }
    })

    const FORM_VALIDATION = Yup.object().shape({
        firstName: Yup.string().required('Required'),
        lastName: Yup.string().required('Required'),
        email: Yup.string().required('Required'),
        password: Yup.string().required('Required'),
    });
    const edit_FORM_VALIDATION = Yup.object().shape({
        firstName: Yup.string().required('Required'),
        lastName: Yup.string().required('Required'),
        email: Yup.string().required('Required'),
    });

    useEffect(() => {
        getAllNum(1).then((res) => {
            setPageCount(res.data.pageCount);
            const allData = res.data.results; // Start with data from the first page

            // Fetch data for other pages in a loop
            const fetchPromises = [];
            for (let i = 2; i <= res.data.pageCount; i++) {
                fetchPromises.push(getAllNum(i));
            }

            Promise.all(fetchPromises).then((responses) => {
                // Concatenate data from all pages
                const additionalData = responses.map((res) => res.data.results).flat();
                const mergedData = allData.concat(additionalData);

                // Get the first and last elements
                const firstElement = mergedData[0];
                const lastElement = mergedData[mergedData.length - 1];

                if (firstElement.id === userId) {
                    setFirstDisabled(false)
                    setPrevDisabled(false)
                }
                else if (lastElement.id === userId) {
                    setLastDisabled(false)
                    setNextDisabled(false)
                }



                setALlUsers(mergedData); // Set the state with all the data once
                console.log('First Element:', firstElement);
                console.log('Last Element:', lastElement);
            });
        });
    }, []);

    function handleSave(action) {
        submitFormBTN.current.click();
        setNavigationRoute(action === options.actions[1] ? 1 : action === options.actions[2] ? 2 : 0);
    }
    const hideError = () => {
        setErrorMessage("");
    };
    function getRole(data) {
        setRoles([...data]);
    }
    function getBranch(data) {
        setBracnches([...branches, data]);
    }
    function show(values) {
        if (mode === "edit") {
            let rolesData = roles.map((item) => item.id)
            updateUser(userId, {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email
            }).then((res) => {
                // if (data.length != rolesData.length) {
                //     alert('hi')
                //     addUserRule({ userId: userId, roleIds: rolesData }).then((res) => {
                //         alert('okkkkk');
                //     })
                // }
                if (branches.length > 0) {
                    let branchesData = branches.map((item) => item.id)
                    addUserBranches({
                        userId: userId,
                        branchIds: branchesData
                    }).then((response) => {
                        setErrorMessage("")
                        showToast("Successfully updated", 2000, "success");
                        setTimeout(() => {
                            if (navigationRoute === 1) {
                                navigate(`/administration/user`);
                            } else if (navigationRoute === 2) {
                                navigate(`/administration/user/add`, { state: "add" });
                            } else if (navigationRoute === 0) {
                                navigate(`/administration/user/edit/${res.data}`, { state: "edit" });
                            }
                        }, 2000);
                    }).catch((err) => {
                        console.log(err);
                    })
                }
                else {
                    setErrorMessage("")
                    showToast("Successfully updated", 2000, "success");
                    setTimeout(() => {
                        if (navigationRoute === 1) {
                            navigate(`/administration/user`);
                        } else if (navigationRoute === 2) {
                            navigate(`/administration/user/add`, { state: "add" });
                        } else if (navigationRoute === 0) {
                            navigate(`/administration/user/edit/${res.data}`, { state: "edit" });
                        }
                    }, 2000);
                }

            }).catch((err) => {
                console.log(err)
                showToast(err.response.data.title, 2000, "error");
                setErrorMessage(err.response.data.title)
                setTimeout(() => {
                    setErrorMessage("")
                }, 3000)
            })
        }
        if (mode === "add") {
            let rolesData = roles.map((item) => item.id)
            let data = {
                ...values,
                roleIds: rolesData
            }

            addUser(data).then((res) => {
                setErrorMessage("")
                showToast("added successfully", 2000, "success")
                setTimeout(() => {
                    if (navigationRoute === 1) {
                        navigate(`/administration/user`);
                    } else if (navigationRoute === 2) {
                        navigate(`/administration/user/add`, { state: "add" });
                    } else if (navigationRoute === 0) {
                        navigate(`/administration/user/edit/${res.data}`, { state: "edit" });
                    }
                }, 2000);
            }).catch((error) => {
                console.log(error.response.data.Message)
                showToast(error.response.data.Message, 2000, "error")
                setErrorMessage(error.response.data.Message)
            })
        }

    }
    const columnRole = [
        { title: 'Name of Role', field: 'roleName' }];
    const columnBranch = [
        { title: 'Name of Branch', field: 'nameEn' },
    ];



    const deleteInRow = oldData => {
        const shouldDelete = window.confirm(`Are you sure you want to delete User with Name: ${oldData.firstName}?`);
        if (shouldDelete)
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (value == 0) {
                        const dataDelete = [...roles];
                        const index = oldData.tableData.id;
                        dataDelete.splice(index, 1);
                        setRoles([...dataDelete]);
                    }
                    else {
                        const dataDelete = [...branches];
                        const index = oldData.tableData.id;
                        dataDelete.splice(index, 1);
                        setBracnches([...dataDelete]);
                    }

                    resolve()
                }, 1000)
            });
    }


    const editInPage = (event, rowData) => {
        alert('fghjk')
    };





    return (
        <Formik
            enableReinitialize
            validationSchema={mode === "add" ? FORM_VALIDATION : edit_FORM_VALIDATION}
            initialValues={{
                ...initialValues
            }}
            onSubmit={(values, actions) => show(values)}>
            {({ setFieldValue, dirty }) => (
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' , backgroundColor: (theme) => theme.palette.mode == "dark" ? "#000" : "#153d77"}}>
                           <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginX: '20px',
                    alignItems: 'center',
                    mb: '15px'
                  }}>

                        <PageTitle text={mode === "add" ? "Add User" : mode === "edit" ? "Edit User" : 'View User'} />

                        <Box sx={{ marginY: 0, marginX: "20px", display: "flex" }} >
                            {
                                mode !== "edit" ?
                                    <DropdownButton
                                        disabled={mode !== "view"}
                                        options={{
                                            actions: ['Edit'],
                                            handler: function () {
                                                navigate(`/administration/user/edit/${userId}`, { state: "edit" });
                                            }
                                        }}
                                        iconName="edit"
                                        buttonColor={''}
                                    /> :
                                    <DropdownButton
                                        disabled={mode !== "edit"}
                                        options={{
                                            actions: ['View'],
                                            handler: function () {
                                                navigate(`/administration/user/${userId}`, { state: "view" });
                                            }
                                        }}
                                        iconName="edit"
                                        buttonColor={''}
                                    />
                            }

                            <DropdownButton
                                disabled={!dirty && mode === "add"}
                                options={{
                                    actions: ['Add'],
                                    handler: function () {
                                        navigate('/administration/user/add', { state: "add" });
                                    }
                                }}
                                iconName="addCircle"
                                buttonColor={''}
                            />
                            <DropdownButton
                                disabled={!firstDisabled || mode === "add"}
                                options={{
                                    actions: ["First"],
                                    handler: function () {
                                        let index = 0

                                        for (let i = 0; i < allUsers.length; i++) {
                                            if (allUsers[i]["id"] == userId) {

                                                index = i
                                            }
                                        }
                                        if (index == 0) {
                                            setFirstDisabled(false)
                                        }
                                        else {
                                            console.log(index)
                                            navigate(`/administration/user/${mode === "edit" ? "edit/" : ""}${allUsers[0].id}`, { state: `${mode}` });
                                        }
                                    }
                                }}
                                buttonColor={''}
                            />
                            <DropdownButton
                                disabled={!prevDisabled || mode === "add"}
                                options={{
                                    actions: [],
                                    handler: function () {
                                        let index = 0
                                        for (let i = 0; i < allUsers.length; i++) {
                                            if (allUsers[i]["id"] == userId) {
                                                index = i
                                            }
                                        }
                                        if (index == 0) {
                                            setPrevDisabled(false)
                                        }
                                        else {
                                            console.log(index)
                                            navigate(`/administration/user/${mode === "edit" ? "edit/" : ""}${allUsers[index - 1].id}`, { state: `${mode}` });
                                        }
                                    }
                                }}
                                iconName="ArrowBackIosIcon"
                                buttonColor={''}
                            />
                            <DropdownButton
                                disabled={!nextDisabled || mode === "add"}
                                options={{
                                    actions: [],
                                    handler: function () {
                                        let index = 0
                                        for (let i = 0; i < allUsers.length; i++) {
                                            if (allUsers[i]["id"] == userId) {
                                                index = i
                                            }
                                        }
                                        if (index == allUsers.length - 1) {
                                            setNextDisabled(true)
                                        }
                                        else {
                                            console.log(index)
                                            navigate(`/administration/user/${mode === "edit" ? "edit/" : ""}${allUsers[index + 1].id}`, { state: `${mode}` });
                                        }
                                    }
                                }}
                                iconName="ArrowForwardIosIcon"
                                buttonColor={''}
                            />
                            <DropdownButton
                                disabled={!lastDisabled || mode === "add"}
                                options={{
                                    actions: ["Last"],
                                    handler: function () {
                                        let index = 0
                                        for (let i = 0; i < allUsers.length; i++) {
                                            if (allUsers[i]["id"] == userId) {
                                                index = i
                                            }
                                        }
                                        if (index == allUsers.length - 1) {
                                            setFirstDisabled(false)
                                        }
                                        else {
                                            console.log(index)
                                            navigate(`/administration/user/${mode === "edit" ? "edit/" : ""}${allUsers[allUsers.length - 1].id}`, { state: `${mode}` });
                                        }
                                    }
                                }}
                                buttonColor={''}
                            />
                            <DropdownButton
                                options={{
                                    actions: ['Delete'],
                                    handler: function () {
                                        if (!window.confirm(`Are You Sure You Want To Delete This ${user?.data?.firstName}`)) {
                                            return;
                                        }
                                        DeleteUser([userId]).then((res) => {
                                            navigate('/administration/user');
                                        }).catch((error) => {
                                            console.log(error)
                                        });
                                    }
                                }}
                                iconName="delete"
                                buttonColor={'red'}
                                disabled={false}
                            />
                            <DropdownButton buttonName="Save" options={options} icon="save" iconName="save" />
                            {/* <DropdownButton buttonName="Save" options={options} icon="save" /> */}
                        </Box>
                    </Box>
                    {
                        mode === "add" ?
                            <PathBreadcrumbs crumbs={location.pathname.substring(1).split('/').map((string) => string.replace(/-/g, ' '))} /> :
                            <PathBreadcrumbs crumbs={location.pathname.substring(1).split('/').slice(0, -1).map((string) => string.replace(/-/g, ' '))} />
                    }
                    <Form>
                        <Section name={'Add User'}>
                            <ToastContainer />
                            <ErrorMessageBox errorMessage={errorMessage} onClose={hideError} />
                            <Grid item xs={12} md={4}>
                                {
                                    mode !== "view" ?
                                        <Textfield name="firstName" label="First Name" placeholder="Enter First Name" /> :
                                        <Tfield name="firstName" label="firstName" value={user?.data?.firstName} />
                                }
                            </Grid>
                            <Grid item xs={12} md={4}>
                                {
                                    mode !== "view" ?
                                        <Textfield name="lastName" label="Last Name" placeholder="Enter Last Name" /> :
                                        <Tfield name="lastName" label="lastName" value={user?.data?.lastName} />
                                }
                            </Grid>
                            <Grid item xs={12} md={4}>
                                {
                                    mode !== "view" ?
                                        <Textfield name="email" label="Email" placeholder="Enter Email" /> :
                                        <Tfield name="email" label="email" value={user?.data?.email} />
                                }
                            </Grid>
                            <Grid item xs={12} md={4}>
                                {
                                    mode === "add" ?
                                        <Textfield name="password" label="Password" placeholder="Enter password" /> :
                                        <Tfield name="password" label="password" placeholder="Enter password" />
                                }
                            </Grid>
                        </Section>
                        <Section name={'User Details'}>

                            <>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <Tabs value={value} onChange={(e, val) => setValue(val)} aria-label="basic tabs example">
                                        <Tab label="Roles" value={0} />
                                        <Tab label="Branches" value={1} />
                                    </Tabs>
                                </Box>
                                <Box sx={{ width: '100%' }}>
                                    {value == 0 ? <RoleUi handleRole={getRole} mode={mode} /> : <BranchUi mode={mode} handleBranch={getBranch} />}

                                </Box>
                            </>

                            <Box sx={{ width: '100%' }}>
                                <ValueTable handleDelete={deleteInRow} editInPage={editInPage}
                                    col={value == 0 ? columnRole : columnBranch}
                                    data={value == 0 ? roles : branches}
                                />
                            </Box>
                        </Section>
                        <Button ref={submitFormBTN} sx={{ display: 'none' }} type="submit" />
                    </Form>
                </Box>
            )}
        </Formik>

    );
};

