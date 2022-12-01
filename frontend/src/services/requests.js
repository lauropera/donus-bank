import { api } from '../lib/axios';

export const setTokenHeaders = (token) => {
  api.defaults.headers.common.Authorization = token;
};

const requests = {
  get: {
    user: async () => {
      const { data } = await api.get('/auth/me');
      return data;
    },
    transactions: async (option) => {
      const filterOption = option ? `?filter=${option}` : '';

      const { data } = await api.get(`/transactions/all${filterOption}`);
      return data;
    },
  },
  post: {
    login: async (body) => {
      const { data } = await api.post('/auth/login', body);
      return data;
    },
    signUp: async (body) => {
      const { data } = await api.post('/auth/register', body);
      return data;
    },
    transaction: async (body, method) => {
      await api.post(`/transactions/new?transferType=${method}`, body);
    },
  },
  patch: {
    deposit: async (body) => {
      await api.patch('/transactions/deposit', body);
    },
  },
};

export default requests;
