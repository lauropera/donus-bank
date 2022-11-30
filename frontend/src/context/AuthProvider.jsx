import { createContext, useEffect, useState } from 'react';
import { setToken } from '../services/requests';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState('');

  useEffect(() => {
    const tokenInStorage = localStorage.getItem('token');
    if (tokenInStorage) {
      setAuth(tokenInStorage);
      setToken(tokenInStorage);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
