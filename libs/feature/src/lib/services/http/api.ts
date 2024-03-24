import axios from 'axios';
import { getUserLocalStorage } from '../utils';

export const generalApi = axios.create({
  baseURL: 'http://localhost:3001/api-general',
});

generalApi.interceptors.request.use(
  (config) => {
    const user = getUserLocalStorage();
    config.headers.Authorization = user?.token;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
