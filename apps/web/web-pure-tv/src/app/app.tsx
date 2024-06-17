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
} from '@workspaces/feature';
import { useLocation, useNavigate } from 'react-router-dom';

const App = () => {
  return (
    <AppThemeProvider>
      <LoggedUserProvider>
        <Content />
      </LoggedUserProvider>
    </AppThemeProvider>
  );
};

const Content = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <>
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
