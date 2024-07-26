/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { getUserLocalStorage } from '../../utils';

export const generalApi = axios.create({
  baseURL: `${process.env['NX_APP_DEFAULT_PROTOCOL']}${process.env['NX_APP_DEFAULT_HOST']}:${process.env['NX_APP_BACK_GENERAL']}/api-general`,
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
