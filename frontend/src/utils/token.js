export const getToken = () => {
  return localStorage.getItem('token');
}

export const removeToken = () => {
  localStorage.removeItem('token');
}
