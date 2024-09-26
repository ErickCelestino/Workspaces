import { useEffect } from 'react';
import './app.scss';
import { AppRouters, AuthRouters } from './routes';
import {
  AppThemeProvider,
  DrawerProvider,
  FileModalContainer,
  FileModalProvider,
  LoggedUserProvider,
  MiniDrawer,
  getItemLocalStorage,
  useAuth,
  LoadingProvider,
  useLoading,
} from '@workspaces/feature';
import { useLocation, useNavigate } from 'react-router-dom';

const App = () => {
  return (
    <AppThemeProvider>
      <LoggedUserProvider>
        <LoadingProvider>
          <Content />
        </LoadingProvider>
      </LoggedUserProvider>
    </AppThemeProvider>
  );
};

const Content = () => {
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

export default App;
