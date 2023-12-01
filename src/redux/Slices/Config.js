import { createSlice } from '@reduxjs/toolkit';

const config = createSlice({
  name: 'config',
  initialState: {
    lang: 'en',
    isLight: true,
    fontFamily: `'Roboto', sans-serif`,
    borderRadius: 12
  },
  reducers: {
    changeLang: (state, action) => {
      state.lang = action.payload === 'ar' ? 'ar' : 'en';
    },
    changeTheme: (state, action) => {
      state.isLight = action.payload;
    },
    changeFontFamily: (state, action) => {
      state.fontFamily = action.payload;
    },
    changeBorderRadius: (state, action) => {
      state.borderRadius = action.payload;
    }
  }
});

export const { changeLang, changeTheme, changeFontFamily, changeBorderRadius } = config.actions;

export default config.reducer;
