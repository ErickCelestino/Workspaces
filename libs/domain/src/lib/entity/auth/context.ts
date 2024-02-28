import { ILoggedUser } from './logged-user';

export interface IContext extends ILoggedUser {
  authenticate: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
