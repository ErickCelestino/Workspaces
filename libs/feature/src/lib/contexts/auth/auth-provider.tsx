import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  LoginRequest,
  getUserLocalStorage,
  setUserLocalStorage,
} from '../../services';
import { IAuthContext, IAuthProvider, ILoggedUser } from '@workspaces/domain';

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const AuthProvider = ({ children }: IAuthProvider) => {
  const [user, setUser] = useState<ILoggedUser | null>();

  useEffect(() => {
    const user = getUserLocalStorage();

    if (user) {
      setUser(user);
    }
  }, []);

  const authenticate = useCallback(async (email: string, password: string) => {
    const response = await LoginRequest(email, password);
    const payload = { token: response.token, email };

    setUser(payload);
    setUserLocalStorage(payload);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setUserLocalStorage(null);
  }, []);

  const isAuthenticated = useMemo(() => !!user, [user]);
  return (
    <AuthContext.Provider
      value={{ ...user, authenticate, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};
