import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';
import { DrawerOption } from '@workspaces/domain';

interface DrawerContextData {
  isDrawerOpen: boolean;
}

const DrawerContext = createContext({} as DrawerContextData);

export const useDrawerContext = () => {
  return useContext(DrawerContext);
};

interface DrawerContextData {
  isDrawerOpen: boolean;
  toggleDrawerOpen: () => void;
  drawerOptions: DrawerOption[];
  setDrawerOptions: (newDrawerOptions: DrawerOption[]) => void;
}

interface DrawerProviderProps {
  children: ReactNode;
}

export const DrawerProvider: FC<DrawerProviderProps> = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerOptions, setDrawerOptions] = useState<DrawerOption[]>([]);

  const handleSetDrawerOptions = useCallback(
    (newDrawerOptions: DrawerOption[]) => {
      setDrawerOptions(newDrawerOptions);
    },
    []
  );

  const toggleDrawerOpen = useCallback(() => {
    setIsDrawerOpen((oldDrawerOpen) => !oldDrawerOpen);
  }, []);

  return (
    <DrawerContext.Provider
      value={{
        isDrawerOpen,
        drawerOptions,
        toggleDrawerOpen,
        setDrawerOptions: handleSetDrawerOptions,
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
};
