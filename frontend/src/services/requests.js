import { api } from '../lib/axios';

export const setToken = (token) => {
  api.defaults.headers.common.Authorization = token;
};

export const requestLogin = async (body) => {
  const { data } = await api.post('/auth/login', body);
  return data;
};
