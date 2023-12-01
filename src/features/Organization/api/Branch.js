import { axios } from '../../../lib/axios';

export const Add = async (data) => {
  return axios.post(`/companybranch`, data);
};
export const Update = async ({ payload, id }) => {
  return axios.put(`/CompanyBranch/?id=${id}`, payload, {
    headers: {
      'Content-Type': 'application/json',
    }
  },);
};

export const Delete = async (id) => {
  return axios.delete(`/CompanyBranch/?id=${id}`);
};

export const GetAll = async () => {
  return axios.get(`/CompanyBranch/All`);
};
export const GetObjectTypes = async () => {
  return axios.get(`/companybranch/objectTypes`);
};

export const GetById = async (id) => {
  return axios.get(`/CompanyBranch?id=${id}`);
};

export const getAllCompaniesLookup = async () => {
  try {
    const response = await axios.get('/company/lookup');
    return response.data;
  } catch (error) {
    throw error;
  }
};
