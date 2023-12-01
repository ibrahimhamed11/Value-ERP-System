import React from 'react';
import {  Box} from '@mui/material';

const AddInRow = ({ children }) => {
    return (
        <Box   sx={{marginBottom:"10px",display:"flex",alignItems:"center", width:"100%",gap:"5px"}}>
            {children}
        </Box>
    )
}

export default AddInRow;
