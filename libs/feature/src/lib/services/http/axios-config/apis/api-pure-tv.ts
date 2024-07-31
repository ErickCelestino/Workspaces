import axios from 'axios';
import { getUserLocalStorage } from '../../../utils';

const url = `${process.env['NX_APP_DEFAULT_PROTOCOL'] ?? 'http://'}${
  process.env['NX_APP_DEFAULT_HOST'] ?? 'localhost'
}:${process.env['NX_APP_BACK_PURE_TV'] ?? '3000'}/api-pure-tv`;
export const pureTvApi = axios.create({
  baseURL: url,
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
