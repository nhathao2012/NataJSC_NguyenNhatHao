// axiosApi.js
import axios from 'axios';

const axiosApi = axios.create({
    baseURL: 'http://localhost:5129/api',
    timeout: 10000,
});

axiosApi.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

axiosApi.interceptors.response.use((response) => response,
    error => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');

        }
        return Promise.reject(error);
    });

export default axiosApi;