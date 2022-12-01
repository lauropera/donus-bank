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
  },
  patch: {
    deposit: async (body) => {
      const { data } = await api.patch('/transactions/deposit', body);
      return data;
    },
  },
};

export default requests;
