import React, { 
  createContext, 
  useContext, 
  useState, 
  ReactNode 
} from 'react';
import { api } from '../services/api';

interface IUser {
  id: string;
  email: string;
  name: string;
  driver_license: string;
  avatar: string;
}

interface IAuthState {
  token: string;
  user: IUser;
}

interface ISignInCredentials {
  email: string;
  password: string;
}

interface IAuthContextData {
  user: IUser;
  signIn: (credentials: ISignInCredentials) => Promise<void>;
}

interface IAuthProvider {
  children: ReactNode;
}

const AuthContext = createContext<IAuthContextData>(
  {} as IAuthContextData
);

function AuthProvider({ children }: IAuthProvider) {
  
  const [data, setData] = useState<IAuthState>({} as IAuthState);

  async function signIn({ email, password }: ISignInCredentials) {
    const response = await api.post('/sessions', {
      email,
      password
    });

    const { token, user } = response.data as IAuthState;

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user });
  }

  return (
    <AuthContext.Provider
      value={{
        user: data.user,
        signIn: signIn
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth };

