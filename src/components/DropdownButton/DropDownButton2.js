import React, { useState, useRef } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import IosShareIcon from '@mui/icons-material/IosShare';
import { styled } from '@mui/material/styles';
import { Save as SaveIcon } from '@mui/icons-material';

const ContainerList = styled('div')`
    display: flex;
`;

const CustomButton = styled(Button)(({ selected }) => `
    background-color: ${selected ? '#19a8e3' : '#19a8e3'};
    width: 140px;
    height: 40px;
    border-radius: 0;
    transition: background-color 0.3s;
    &:hover {
        background-color: #14739e;
    }
`);

const SubMenuButton = styled(Button)`
    text-transform: none;
    border-radius: 0;
    width: 35px;
    height: 40px;
    min-width: auto;
    min-height: auto;
`;

const IconStyle = {
    transform: 'rotate(0deg)', // Default rotation
};

const RotatedIconStyle = {
    transform: 'rotate(-90deg)', // Rotated by -90 degrees
};

const DropdownButton = ({ buttonName, options, icon }) => {
    let selectedIcon = null;
    if (icon === 'add') {
        selectedIcon = <AddCircleIcon style={IconStyle} />;
    } else if (icon === 'export') {
        selectedIcon = <IosShareIcon style={IconStyle} />;
    } else if (icon === 'save') {
        selectedIcon = <SaveIcon style={IconStyle} />;
    } else {
        selectedIcon = null;
    }

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const containerRef = useRef(null);

    const handleSubMenuButtonClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (index) => {
        setSelectedIndex(index);
        setAnchorEl(null);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const selectedOptionLabel = options[selectedIndex]?.name || buttonName;

    return (
        <ContainerList ref={containerRef}>
            <Menu
                id="dropdown-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        width: '175px',
                    },
                }}
                sx={{ '.MuiMenu-paper': { borderRadius: (theme) => theme.spacing(0, 0, 0, 0) ,} }}
            >
                {options.map((option, index) => (
                    <MenuItem
                        sx={{ '.MuiMenu-paper': { borderRadius: (theme) => theme.spacing(0, 0, 0, 0) ,flexDirection:'row-reverse'} }}
                        key={index}
                        selected={index === selectedIndex}
                        onClick={() => {
                            handleMenuItemClick(index);
                            option.handler();
                        }}
                    >
                        {option.name}
                    </MenuItem>
                ))}
            </Menu>
            <CustomButton
                color="primary"
                variant="contained"
                size="small"
                startIcon={selectedIcon}
                selected={selectedIndex === 0}
                onClick={() => options[selectedIndex]?.handler()}
            >
                {selectedOptionLabel}
            </CustomButton>
            {options.length > 1 && (
                <SubMenuButton
                    aria-controls="dropdown-menu"
                    aria-haspopup="true"
                    onClick={handleSubMenuButtonClick}
                    color="primary"
                    variant="contained"
                    endIcon={<KeyboardArrowDownIcon style={anchorEl ? RotatedIconStyle : IconStyle} />} 
                    size="small"
                />
            )}
        </ContainerList>
    );
};

export default DropdownButton;
