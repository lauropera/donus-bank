import { createContext, useEffect, useState } from 'react';
import { setToken } from '../services/requests';
import { getToken } from '../utils/token';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState('');

  useEffect(() => {
    const tokenInStorage = getToken();
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
