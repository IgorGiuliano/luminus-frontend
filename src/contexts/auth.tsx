import React, { createContext, useState, useEffect, useContext } from 'react';

import { api } from '../services/api';

interface AuthContextData {
  signed: boolean;
  user: object | null;
  Login(user: object): Promise<void>;
  Logout(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<object | null>(null);

  useEffect(() => {
    const storagedUser = sessionStorage.getItem('@App:cod');
    const storagedToken = sessionStorage.getItem('@App:token');

    if (storagedToken && storagedUser) {
      if(storagedToken === undefined || storagedUser === undefined) {
          sessionStorage.clear();
      }

      setUser({cod: storagedUser});
      api.defaults.headers.common.Authorization = `Bearer ${storagedToken}`;
    }
  }, []);

  async function Login(userData: object) {
    const response = await api.post('/authenticate', userData);

    console.log(response)

     if(response.data.Error) {
       window.alert("Ocorreu um erro: "+response.data.Error)
    }else {
 
      setUser(response.data.user);
      api.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;
  
      sessionStorage.setItem('@App:cod', response.data.user.cod);
      sessionStorage.setItem('@App:token', response.data.token);

    }
  }

  function Logout() {
    sessionStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ signed: Boolean(user), user, Login, Logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}