import { api } from '../lib/axios';

export const setTokenHeaders = (token) => {
  api.defaults.headers.common.Authorization = token;
};

export const requestLogin = async (body) => {
  const { data } = await api.post('/auth/login', body);
  return data;
};

export const requestSignUp = async (body) => {
  const { data } = await api.post('/auth/register', body);
  return data;
}

export const requestDeposit = async (body) => {
  const { data } = await api.patch('/transactions/deposit', body);
  return data;
}
