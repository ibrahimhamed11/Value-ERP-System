import * as React from 'react';
import { Route, Routes } from 'react-router-dom';

import { Login } from '../components/LoginForm';

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
    </Routes>
  );
};
