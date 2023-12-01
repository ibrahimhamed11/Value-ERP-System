import { axios } from '../../../lib/axios';

export const loginWithEmailAndPassword = async (data) => {
  return axios.post('/Auth/Login', data);
};
