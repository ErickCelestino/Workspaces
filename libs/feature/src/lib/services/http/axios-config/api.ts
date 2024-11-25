/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { getUserLocalStorage } from '../../utils';

const url = `${process.env['NX_PUBLIC_DEFAULT_PROTOCOL'] ?? 'http://'}${
  process.env['NX_PUBLIC_DEFAULT_HOST'] ?? 'localhost'
}:${process.env['NX_PUBLIC_BACK_GENERAL'] ?? '3001'}/api-general`;
export const generalApi = axios.create({
  baseURL: url,
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
