import { axios } from '../../../lib/axios';
export const getAll = async () => {
    try {
      const response = await axios.get('/CostCenterCategory/lookup');
      return response.data;
    } catch (error) {
      throw error;
    }
  };
export const add = async (id) => {
    return axios.post(`/CostCenterCategory`, id);
};
export const DeleteCostCenterCategory = async (id) => {
    return axios.delete(`/CostCenterCategory/?id=${id}`);
};





export const Update = async ({ data, id }) => {
  try {
    console.log(data);
    const response = await axios.put(`/CostCenterCategory/?id=${id}`, data, {
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
    return axios.get(`/CostCenterCategory/?id=${id}`);
};