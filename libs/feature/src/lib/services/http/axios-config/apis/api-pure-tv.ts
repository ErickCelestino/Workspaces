import axios from 'axios';
import { getUserLocalStorage } from '../../../utils';

export const pureTvApi = axios.create({
  baseURL: 'http://localhost:3000/api-pure-tv',
});

pureTvApi.interceptors.request.use(
  (config) => {
    const user = getUserLocalStorage();
    config.headers.Authorization = user?.token;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
