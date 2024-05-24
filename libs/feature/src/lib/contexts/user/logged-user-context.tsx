import { LoggedUser } from '@workspaces/domain';
import { FC, ReactNode, createContext, useContext, useState } from 'react';

interface LoggedUserContextProps {
  loggedUser: LoggedUser | null;
  setLoggedUser: React.Dispatch<React.SetStateAction<LoggedUser | null>>;
}

const LoggedUserContext = createContext<LoggedUserContextProps>({
  loggedUser: null,
  setLoggedUser: () => {},
});

export const LoggedUserProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [loggedUser, setLoggedUser] = useState<LoggedUser | null>(null);

  return (
    <LoggedUserContext.Provider value={{ loggedUser, setLoggedUser }}>
      {children}
    </LoggedUserContext.Provider>
  );
};

export const useLoggedUser = () => useContext(LoggedUserContext);
