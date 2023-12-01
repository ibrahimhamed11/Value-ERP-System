import { axios } from '../../../lib/axios';



export const AddGLAccount = async (data) => {
  console.log(data)
  return axios.post(`/GLAccount`, data);
};

export const Update = async ({ payload, glAccountId }) => {
  return axios.put(`/GLAccount/?id=${glAccountId}`, payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};


export const DeleteGLAccount = async (id) => {
  return axios.delete(`/GLAccount/?id=${id}`);
};




export const getAll = async () => {
  try {
    const response = await axios.get('/GLAccount/Tree');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllLook = async () => {
  try {
    const response = await axios.get('/GLAccount/lookup');
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getAllCategory = async () => {
  try {
    const response = await axios.get('/CostCenterCategory/lookup');
    return response.data;
  } catch (error) {
    throw error;
  }
};



export const GetById = async (glAccountId) => {
  return axios.get(`/GLAccount/?id=${glAccountId}`);
};


export const GetCostCenterCategoryById = async (costCenterCategoryId) => {
  return axios.get(`/CostCenterCategory/?id=${costCenterCategoryId}`);
};



