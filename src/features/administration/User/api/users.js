import { axios } from '../../../../lib/axios';

export const addUser = async (data) => {
    return axios.post(`/user`, data);
};


export const addUserRule = async (data) => {
    return axios.post(`/userroles`, {
        "userId": "6074e9a6-2b0d-4787-7224-08dbf0699a4d",
        "roleIds": [
            "267eb572-42aa-47d1-ed7c-08dbc04408a8"]
    });
};
export const getAllRule = async () => {

    return axios.get(`/role/all`);
};
export const getAll = async () => {
    return axios.get(`/user/all`);
};
export const getAllNum = async (pageNumber) => {
    return axios.get(`/user/all/?pageNumber=${pageNumber}`);
};

export const GetAllBranches = async () => {
    return axios.get(`/CompanyBranch/All`);
};
export const updateUser = async (id, payload) => {

    return axios.put(`/user/?id=${id}`, payload, {
        headers: {
            "Content-type": "application/json",
        },
    });
};
export const addUserBranches = async (payload) => {
    console.log(payload)
    return axios.post(`/userbranches`, payload);
};
export const getUserBranches = async (id) => {
    return axios.get(`/userbranches/?userid=${id}`);
};
export const GetById = async (id) => {
    return axios.get(`/user/?id=${id}`);
};


export const GetByIdRole = async (id) => {
    return axios.get(`/userroles/?userid=${id}`);
};




export const DeleteUser = async (id) => {
    return axios.delete(`/User?id=${id}`);
};


