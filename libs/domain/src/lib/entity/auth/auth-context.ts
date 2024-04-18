import { ILoggedUser } from './logged-user';

export interface IAuthContext extends ILoggedUser {
  authenticate: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
