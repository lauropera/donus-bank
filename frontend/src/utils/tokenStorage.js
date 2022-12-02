export const getToken = () => {
  return localStorage.getItem('donus-bank:auth-token') || '';
}

export const removeToken = () => {
  localStorage.removeItem('donus-bank:auth-token');
}
