import { axios } from '../../../lib/axios';

export const AddCompany = async (data) => {
  return axios.post(`/Company`, data);
};

export const Update = async ({ data, id }) => {
  try {
    console.log(data);
    const response = await axios.put(`/Company/?id=${id}`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};



export const getAllLookup = async () => {
  try {
    const response = await axios.get('/company/lookup');

    return response.data;
  } catch (error) {
    throw error;
  }
};




export const Delete = async (id) => {
  return axios.delete(`/Company/?id=${id}`);
};

export const GetAll = async () => {
  return axios.get(`/Company/All`);
};

export const GetById = async (id) => {
  return axios.get(`/Company?id=${id}`);
};
