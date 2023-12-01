import { axios } from '../../../lib/axios';

export const GetUserById = async (id) => {
    return axios.get(`/user/?id=${id}`);
};
export const getUser = () => {
    return axios.get('/User/CurrentUser', {
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });
  };