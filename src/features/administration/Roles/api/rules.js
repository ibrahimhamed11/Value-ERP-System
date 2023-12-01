import { axios } from '../../../../lib/axios';

export const addRule = async (data) => {
    return axios.post(`/role`, data);
};
export const addUserRule = async (data) => {
    return axios.post(`/userroles`, data);
};
export const getAllRule = async () => {

    return axios.get(`/role/all`);
};
export const getAllUser = async () => {
    return axios.get(`/user/all`);
};





export const Update = async ({ data, id }) => {
    try {
      console.log(data);
      const response = await axios.put(`/role/?id=${id}`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  



export const GetById = async (id) => {
    return axios.get(`/role/?id=${id}`);
};

export const DeleteRoleByid = async (id) => {
    return axios.delete(`/role?id=${id}`);
};
