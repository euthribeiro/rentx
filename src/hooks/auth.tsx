import React, { 
  createContext, 
  useContext, 
  useState, 
  ReactNode,
  useEffect
} from 'react';
import { api } from '../services/api';
import { database } from '../database';
import { User as ModelUser } from '../database/models/User';

interface IUser {
  id: string;
  user_id: string;
  email: string;
  name: string;
  driver_license: string;
  avatar: string;
  token: string;
}

interface ISignInCredentials {
  email: string;
  password: string;
}

interface IAuthContextData {
  user: IUser;
  loading: boolean;
  signIn: (credentials: ISignInCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (user: IUser) => Promise<void>;
}

interface IAuthProvider {
  children: ReactNode;
}

const AuthContext = createContext<IAuthContextData>(
  {} as IAuthContextData
);

function AuthProvider({ children }: IAuthProvider) {
  
  const [data, setData] = useState<IUser>({} as IUser);
  const [loading, setLoading] = useState(true);

  async function signIn({ email, password }: ISignInCredentials) {
    try {
      const response = await api.post('/sessions', {
        email,
        password
      });
  
      const { token, user } = response.data;

      api.defaults.headers.authorization = `Bearer ${token}`;
  
      await database.write(async () => {
        const userInserted = await database.get<ModelUser>('users').create(newUser => {
          newUser.user_id = user.id,
          newUser.name = user.name,
          newUser.avatar = newUser.avatar,
          newUser.driver_license = user.driver_license,
          newUser.email = user.email,
          newUser.token = token
        });

        setData({ ...user, id: userInserted._raw.id, token  });
      });


    } catch(error: any) {
      throw new Error(error);
    }
  }

  async function signOut() {
    try {
      await database.write(async () => {
        const userSelected = await database.get<ModelUser>('users')
          .find(data.id);
        
        await userSelected.destroyPermanently();

        setData({} as IUser);
      })
    } catch(e: any) {
      throw new Error(e);
    }
  }

  async function updateUser(user: IUser) {
    try {
      await database.write(async () => {
        const userSelected = await database.get<ModelUser>('users')
          .find(user.id);

        await userSelected.update((userData) => {
          userData.name = user.name;
          userData.avatar = user.avatar;
          userData.driver_license = user.driver_license;
        });
      });

      setData(user);
    } catch(error: any) {
      throw new Error(error);
    }
  }

  useEffect(() => {

    let isMounted = true;

    async function loadUserData() {
      try {
        var userCollection = database.get<ModelUser>('users');
        const response = await userCollection.query().fetch();

        if(response.length > 0) {
          const userData = response[0]._raw as unknown as IUser;

          api.defaults.headers.authorization = `Bearer ${userData.token}`;

          if(isMounted) {
            setData(userData);
          }
        }
      } catch(e) {}
      finally {
        if(isMounted) {
          setLoading(false);
        }
      }
    }

    loadUserData();

    return () => {
      isMounted = false;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: data,
        signIn: signIn,
        signOut,
        updateUser,
        loading
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

