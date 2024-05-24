import { useEffect } from 'react';
import './app.scss';
import { AppRouters, AuthRouters } from './routes';
import {
  AppThemeProvider,
  DrawerProvider,
  LoggedUserProvider,
  MiniDrawer,
  getItemLocalStorage,
  useAuth,
} from '@workspaces/feature';
import { useNavigate } from 'react-router-dom';

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

  useEffect(() => {
    const token = getItemLocalStorage('u');
    if (!token) {
      navigate('/login');
    }
  }, []);

  return (
    <>
      {!auth.isAuthenticated && <AuthRouters />}
      {auth.isAuthenticated && (
        <DrawerProvider>
          <MiniDrawer image="https://github.com/ErickCelestino.png">
            <AppRouters />
          </MiniDrawer>
        </DrawerProvider>
      )}
    </>
  );
};

export default App;
