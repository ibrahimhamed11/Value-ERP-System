import { configureAuth } from 'react-query-auth';

import { loginWithEmailAndPassword } from '../features/auth';
import { getUser } from '../features/auth';
import storage from '../utils/storage';

export function handleUserResponse(responseData) {
  //TODO Get Id And save it on local storage
  const { data } = responseData;
  // storage.setToken({ token: data });
  // const user = await getUser();
  // storage.setToken({ token: storage.getToken(), user: user });

  const userId = null;
  storage.setToken({ token: data, userId: userId });
  return { userName: 'ahmed' }; //await getUser({ userId: userId });
}

const userFn = async () => {
  const token = storage.getToken();
  if (token) {
    const data = { userName: 'ahmed' }; //TODO Implement User await getUser();
    return data;
  }
  return null;
};

const loginFn = async (data) => {
  try {
    let response = await loginWithEmailAndPassword(data);
    let data = await handleUserResponse(response);
    return data;

  }
  catch (e) {
    console.log(e)
    return e;
  }
  // loginWithEmailAndPassword(data)
  //   .then((response) => {
  //     alert('dd');
  //     console.log('res', response)
  //     return handleUserResponse(response);
  //   })
  //   .catch(() => null);
};

const registerFn = async (data) => {
  //TODO Implement Register Function
  //   const response = await registerWithEmailAndPassword(data);
  //   const user = await handleUserResponse(response);
  //   return user;
  return data;
};

const logoutFn = () => {
  storage.clearToken();
  window.location.assign(window.location.origin);
};

export const { useUser, useLogin, useRegister, useLogout } = configureAuth({
  userFn,
  loginFn,
  registerFn,
  logoutFn
});
