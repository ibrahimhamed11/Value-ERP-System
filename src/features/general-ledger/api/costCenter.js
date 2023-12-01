import { axios } from '../../../lib/axios';

export const getAll = async () => {
    try {
      const response = await axios.get('/CostCenter/Tree');
      return response.data;
    } catch (error) {
      throw error;
    }
  };
export const getAllLookup = async () => {
    try {
      const response = await axios.get('/CostCenter/lookup');
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  
export const addCostCenter = async (data) => {
    return axios.post(`/CostCenter`, data);
};
export const DeleteCostCenter = async (data) => {
    return axios.delete(`/CostCenter/?id=${data}`);
};


export const Update = async ({ data, costCenterId }) => {
  try {
    console.log(data);
    const response = await axios.put(`/CostCenter/?id=${costCenterId}`, data, {
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
    return axios.get(`/CostCenter/?id=${id}`);
};


export const getAllCategory = async () => {
  try {
    const response = await axios.get('/CostCenterCategory/lookup');
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const GetCostCenterCategoryById = async (costCenterCategoryId) => {
  return axios.get(`/CostCenterCategory/?id=${costCenterCategoryId}`);
};