import { ILoggedUser } from '@workspaces/domain';

export function setUserLocalStorage(user: ILoggedUser | null) {
  localStorage.setItem('u', JSON.stringify(user));
}
