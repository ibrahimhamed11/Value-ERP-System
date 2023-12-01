import { useRoutes } from 'react-router-dom';

import { Login } from '../features/auth/components/LoginForm';

import { publicRoutes } from './publicRoutes';
import { protectedRoutes } from './protectedRoutes';
import { useUser } from '../lib/auth';
import React from 'react';
import { useSelector } from 'react-redux';

export const AppRoutes = () => {
  const flag = useSelector(state => state.User.flag)
  //const flag = true;

  const commonRoutes = [{ path: '/', element: <Login /> }];

  const routes = flag ? protectedRoutes : publicRoutes;

  const element = useRoutes([...routes, ...commonRoutes]);

  return <>{element}</>;
};
