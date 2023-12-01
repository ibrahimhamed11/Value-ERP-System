import Axios from 'axios';
import storage from '../utils/storage';

const API_URL = process.env.REACT_APP_API_URL;

function authRequestInterceptor(config) {
  const token = storage.getToken();
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }


  const companyBranchId = '8e4eed89-dd8b-4f69-a17c-61f32f4d80df';
  // const companyBranchId = storage.getCompanyBranchId(); 
  if (companyBranchId) {
    config.headers['company-branch-id'] = companyBranchId;
  }

  config.headers.Accept = 'application/json';
  return config;
}

export const axios = Axios.create({
  baseURL: API_URL,
});

axios.interceptors.request.use(authRequestInterceptor);

// Rest of your Axios configuration and interceptors...

// axios.interceptors.response.use(
//   (response) => {
//     return response.data;
//   },
//   (error) => {
//     const message = error.response?.data?.message || error.message;
//     useNotificationStore.getState().addNotification({
//       type: "error",
//       title: "Error",
//       message,
//     });

//     return Promise.reject(error);
//   }
// );
