import axios from 'axios';
import { getUserLocalStorage } from '../../../utils';

export const pureTvApi = axios.create({
  baseURL: `${process.env['NX_APP_DEFAULT_PROTOCOL']}${process.env['NX_APP_DEFAULT_HOST']}:${process.env['NX_APP_BACK_PURE_TV']}/api-pure-tv`,
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
