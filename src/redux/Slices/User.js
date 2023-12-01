import { createSlice } from '@reduxjs/toolkit';
const User = createSlice({
    name: 'sidebar',
    initialState: {
        flag: sessionStorage.getItem('value_token'),

    },
    reducers: {
        loginUser: (state) => {
            state.flag = sessionStorage.getItem('value_token');
        }
    }
});

export const { loginUser } = User.actions;

export default User.reducer;
