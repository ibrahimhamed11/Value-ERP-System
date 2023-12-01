import { Autocomplete, Box, Button, Modal, TextField } from "@mui/material";
import { Typography } from "antd";
import MaterialReactTable from "material-react-table";
import { useMemo, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { getAllRule } from "../../Roles/api/rules";
import { useQuery } from "@tanstack/react-query";
import { GetAllBranches } from "../api/users";
import DropdownButton from "../../../../components/DropdownButton/DropDownButton";
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 600,
    bgcolor: (theme) => theme.palette.mode == "dark" ? "#1E1E1E" : "background.paper",
    borderRaduis: "8px",
    boxShadow: 24,
    padding: "0 0 12px"
};
export function BranchUi({ handleBranch, view, mode }) {
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);

    const { isLoading, error, data: branches } = useQuery({
        queryKey: ['AllBranch'],
        queryFn: GetAllBranches
    })
    console.log(branches);
    function getBranch() {
        handleBranch(data);
        setOpen(false);
    }

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
                    <Box sx={{ width: '70%' }}>
                        <Autocomplete
                            onChange={(e, value) => setData(value)}
                            getOptionLabel={(rows) => rows.nameEn}
                            options={branches?.data?.results}
                            renderInput={(params) => <TextField

                                {...params}
                                label="branches"
                            />
                            }

                        />

                    </Box>
                    <Box>
                        <Button onClick={getBranch}>Add</Button>

                    </Box>
                </Box>
            </Modal>
            {!view && <Box sx={{ display: 'flex', width: '15%', marginTop: 3, justifyContent: 'space-between' }}>
                <DropdownButton
                    disabled={false}
                    options={{
                        actions: ["New"],
                        handler: () => setOpen(true)
                    }}
                    buttonColor={''}
                />
            </Box>}

        </Box>
    )
}