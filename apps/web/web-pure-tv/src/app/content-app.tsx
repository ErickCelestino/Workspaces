import {
  DrawerProvider,
  FileModalContainer,
  FileModalProvider,
  getItemLocalStorage,
  MiniDrawer,
  useAuth,
  useLoading,
  useLoadUserPureTvData,
  useLoggedUser,
} from '@workspaces/feature';
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppRouters, AuthRouters } from './routes';

export const ContentApp = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading } = useLoading();
  const { loggedUser } = useLoggedUser();
  const loadUserData = useLoadUserPureTvData();
  const hasLoadedUserData = useRef(false);

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

  useEffect(() => {
    if (loggedUser && !hasLoadedUserData.current) {
      loadUserData();
      hasLoadedUserData.current = true;
    }
  }, [loggedUser, loadUserData]);

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
