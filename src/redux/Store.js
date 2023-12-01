import { configureStore } from '@reduxjs/toolkit';
import sidebarReducer from './Slices/Sidebar';
import configReducer from './Slices/Config';
import userReducer from './Slices/User';
export default configureStore({
  reducer: {
    sidebar: sidebarReducer,
    config: configReducer,
    User: userReducer
  }
});
