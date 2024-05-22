import { createContext, FC, ReactNode, useContext } from 'react';

interface AppContextProps {
  appName: string;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppNameProvider: FC<{ children: ReactNode; appName: string }> = ({
  children,
  appName,
}) => {
  return (
    <AppContext.Provider value={{ appName }}>{children}</AppContext.Provider>
  );
};

export const useAppNameContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
