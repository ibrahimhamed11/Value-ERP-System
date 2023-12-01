import { Box } from "@mui/material";
import DropdownButton from "./DropDownButton";


export const GeneralButton = ({ options, next, prev, add, newOne, reset, del, edit }) => {

    return (
        <Box sx={{ marginY: 0, display: "flex" }} zIndex={1000} >
            <DropdownButton
                disabled={!edit?.flag}
                options={{
                    actions: ['Edit'],
                    handler: edit?.action
                }}
                iconName=""
                buttonColor={''}
            />
            <DropdownButton
                disabled={!add?.flag}
                options={{
                    actions: ['New'],
                    handler: add?.action
                }}
                iconName="addCircle"
                buttonColor={''}
            />
            <DropdownButton
                disabled={!prev?.flag}
                options={{
                    actions: [],
                    handler: prev?.action
                }}
                iconName="ArrowBackIosIcon"
                buttonColor={''}
            />
            <DropdownButton
                disabled={!next?.flag}
                options={{
                    actions: [],
                    handler: next?.action
                }}
                iconName="ArrowForwardIosIcon"
                buttonColor={''}
            />
            {/* <DropdownButton
                disabled={reset}
                options={{
                    actions: ['Reset'],
                    handler: function () {
                        alert('reset');

                    }
                }}
                iconName=""
                buttonColor={''}
            /> */}
            <DropdownButton
                options={{
                    actions: ['Delete'],
                    handler: del?.action
                }}
                iconName="delete"
                buttonColor={'red'}
                disabled={!del?.flag}
            />

            {!newOne && <DropdownButton buttonName="Save" options={options} icon="save" iconName="save" />
            }
        </Box>
    );
}