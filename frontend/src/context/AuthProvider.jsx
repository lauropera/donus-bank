import { createContext, useEffect, useState } from 'react';
import { setTokenHeaders } from '../services/requests';
import { getToken } from '../utils/tokenStorage';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState('');

  useEffect(() => {
    const tokenInStorage = getToken();
    if (tokenInStorage) {
      setAuth(tokenInStorage);
      setTokenHeaders(tokenInStorage);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
