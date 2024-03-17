import { useContext } from 'react';
import { AuthContext } from './auth-provider';

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  return context;
};
