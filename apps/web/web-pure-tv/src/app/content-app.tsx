import {
  DrawerProvider,
  FileModalContainer,
  FileModalProvider,
  getItemLocalStorage,
  MiniDrawer,
  useAuth,
  useLoading,
} from '@workspaces/feature';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppRouters, AuthRouters } from './routes';

export const ContentApp = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading } = useLoading();

  useEffect(() => {
    const token = getItemLocalStorage('u');

    if (
      !token &&
      location.pathname !== '/register' &&
      location.pathname !== '/login'
    ) {
      navigate('/login');
    }
  }, [location, navigate]);

  if (isLoading) {
    return <div>Carregando aplicação...</div>;
  }

  return (
    <>
      {console.log(isLoading)}
      {!auth.isAuthenticated && <AuthRouters />}
      {auth.isAuthenticated && (
        <DrawerProvider>
          <FileModalProvider>
            <MiniDrawer image="https://github.com/ErickCelestino.png">
              <AppRouters />
              <FileModalContainer />
            </MiniDrawer>
          </FileModalProvider>
        </DrawerProvider>
      )}
    </>
  );
};
