import axiosApi from "../utils/axiosApi";

export const authApi = {
    login: async (username, password) => {
        const res = await axiosApi.post('/auth/login', { username, password });
        return res.data;
    },
    register: async (data) => {
        return await axiosApi.post('/auth/register', data);;
    },
}
export const userApi = {
    getAll: () => axiosApi.get('/User'),
    delete: (id) => axiosApi.delete(`/User/${id}`),
    create: (data) => axiosApi.post('/Auth/register', data),
    update: (id, data) => axiosApi.put(`/User/${id}`, data)
};


export const forestApi = {
    getAll: () => axiosApi.get('/ForestArea'),
    delete: (id) => axiosApi.delete(`/ForestArea/${id}`),
    create: (data) => axiosApi.post('/ForestArea', data),
    update: (id, data) => axiosApi.put(`/ForestArea/${id}`, data)
};


export const landOwnerApi = {
    getAll: () => axiosApi.get('/LandOwner'),
    delete: (id) => axiosApi.delete(`/LandOwner/${id}`),
    create: (data) => axiosApi.post('/LandOwner', data),
    update: (id, data) => axiosApi.put(`/LandOwner/${id}`, data)
};