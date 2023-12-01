import { axios } from '../../../lib/axios';

export const getAllGLAccount = async () => {
    try {
      const response = await axios.get('/GLAccount/Tree');
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  
  
  
  export const getAllCostCenter = async () => {
    try {
      const response = await axios.get('/CostCenter/Tree');
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const getCostCenterById = async (id) => {
    return axios.get(`/CostCenter/?id=${id}`);
  };
  
  export const addJournal = async (data) => {
    return axios.post(`/Journal`, data);
  };
  
  export const getAll = async () => {
    try {
      const response = await axios.get('/Journal/All');
      return response.data;
    } catch (error) {
    throw error;
  }
};


export const DeleteJournal = async (data) => {
  return axios.delete(`/Journal`,{data});
};

export const GetById = async (id) => {
  return axios.get(`/Journal/?id=${id}`);
};

export const Update = async ({ data, journalId }) => {
  try {
    console.log(data);
    const response = await axios.put(`/Journal/?id=${journalId}`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const GetGLById = async (glAccountId) => {
  return axios.get(`/GLAccount/?id=${glAccountId}`);
};


export const getAllLook = async () => {
  try {
    const response = await axios.get('/GLAccount/lookup');
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

export const GetCostCenteCategoryById = async (id) => {
  return axios.get(`/CostCenterCategory/?id=${id}`);
};