import axios from 'axios';
import { getUserLocalStorage } from '../../../utils';

const url = `${process.env['NX_APP_DEFAULT_PROTOCOL'] ?? 'http://'}${
  process.env['NX_APP_DEFAULT_HOST'] ?? 'localhost'
}:${process.env['NX_APP_BACK_MARKETING'] ?? '3000'}/api-pure-marketing`;
export const pureMaketingApi = axios.create({
  baseURL: url,
});

pureMaketingApi.interceptors.request.use(
  (config) => {
    const user = getUserLocalStorage();
    config.headers.Authorization = user?.token;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
