import { Box, Button, Modal } from "@mui/material";
import { Typography } from "antd";
import MaterialReactTable from "material-react-table";
import { useMemo, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { getAllRule } from "../../Roles/api/rules";
import { useQuery } from "@tanstack/react-query";
import DropdownButton from "../../../../components/DropdownButton/DropDownButton";
const style = {
    position: 'absolute',
    top: '75%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 600,
    bgcolor: (theme) => (theme.palette.mode == 'dark' ? '#1E1E1E' : 'background.paper'),
    borderRaduis: '8px',
    boxShadow: 24,
    padding: '0 0 12px'
};
export function RoleUi({ handleRole, view, mode }) {
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5,
    });
    const [role, setRole] = useState([]);
    const [open, setOpen] = useState(false);
    const arr = [{ roleName: 'iti' }, { roleName: 'iti' }, { roleName: 'iti' }, { roleName: 'iti' }, { roleName: 'iti' }, { roleName: 'iti' }, { roleName: 'iti' }]
    const { isLoading, error, data: roles } = useQuery({
        queryKey: ['AllRoles'],
        queryFn: getAllRule
    })
    function getRole() {
        let x = roles?.data?.results.filter((item, index) => index in rowSelection)
        handleRole(x);
        setRole([...x]);
        setOpen(false);
    }
    console.log(mode != "add");
    const columns = useMemo(
        () => [
            {
                header: 'Name',
                accessorKey: 'roleName',
                enableClickToCopy: true,
                sx: {
                    justifyContent: 'flex-start'
                }
            },
        ],
        []
    );
    return (
        <Box>
            <Modal
                sx={{ position: 'absolute', top: 5 }}
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "16px",
                        backgroundColor: "#153D77",
                        padding: "5px 20px"
                    }}>
                        <Typography sx={{ color: (theme) => theme.palette.mode == "dark" ? "white" : "white", textAlign: "center", fontWeight: "bold", marginBottom: "10px", fontFamily: 'Roboto' }} variant='h3'>Add Roles </Typography>
                        <CloseIcon onClick={() => setOpen(false)} sx={{ color: "white", cursor: "pointer" }} />
                    </Box>
                    <Box sx={{ height: '5%' }}>
                        <MaterialReactTable
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
                            muiTablePaginationProps={

                                {
                                    rowsPerPageOptions: [1, 5],
                                    sx: {

                                        color: (theme) => theme.palette.mode == "dark" && "#fff",
                                    }
                                }}
                            muiTablePaperProps={{
                                elevation: 0,
                                sx: {
                                    borderRadius: '0',
                                    // border: '1px dashed #e0e0e0',
                                },
                            }}

                            muiTableBodyProps={{
                                sx: (theme) => ({
                                    '& tr:hover td': {
                                        backgroundColor: (theme) => theme.palette.mode == "dark" && "#4c3838"
                                    }
                                })
                            }}
                            enableRowSelection
                            columns={columns}
                            onPaginationChange={setPagination}
                            state={{ rowSelection, pagination }}
                            onRowSelectionChange={setRowSelection}

                            data={roles?.data?.results} />
                    </Box>
                    <Box>
                    <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center'
                            }}>
                            <DropdownButton
                              options={{
                                actions: ['Add'],
                                handler: getRole
                              }}
                              iconName=""
                              buttonColor={''}
                              hoverText={'Add New Role'}
                            />
                          </Box>
                        {/* <Button onClick={getRole}>Add</Button> */}

                    </Box>
                </Box>
            </Modal>
            {!view && <Box sx={{ display: 'flex', width: '15%', marginTop: 3, justifyContent: 'space-between' }}>
                <>
                    <DropdownButton
                        disabled={false}
                        options={{
                            actions: ["Link"],
                            handler: () => setOpen(true)
                        }}
                        buttonColor={''}
                    />
                    {/* <DropdownButton
                        disabled={false}
                        options={{
                            actions: ["UnLink"],
                        }}
                        buttonColor={''}
                    /> */}
                </>
            </Box>}

        </Box>
    )
}