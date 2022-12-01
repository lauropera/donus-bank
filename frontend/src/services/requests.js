import { api } from '../lib/axios';

export const setTokenHeaders = (token) => {
  api.defaults.headers.common.Authorization = token;
};

const requests = {
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
      const data = await api.post(
        `/transactions/new?transferType=${method}`,
        body
      );
      return data;
    },
  },
  patch: {
    deposit: async (body) => {
      await api.patch('/transactions/deposit', body);
    },
  },
};

export default requests;
