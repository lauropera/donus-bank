import { api } from '../lib/axios';
import { getToken } from '../utils/tokenStorage';

export const setTokenHeaders = (token) => {
  api.defaults.headers.common.Authorization = token;
};

const requests = {
  get: {
    getUser: async () => {
      setTokenHeaders(getToken());

      const { data } = await api.get('/auth/me');
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
