import './app.scss';
import { AppRouters, AuthRouters } from './routes';
import {
  AppThemeProvider,
  AuthProvider,
  DrawerProvider,
  MiniDrawer,
  useAuth,
} from '@workspaces/feature';

const App = () => {
  return (
    <AppThemeProvider>
      <Content />
    </AppThemeProvider>
  );
};

const Content = () => {
  const auth = useAuth();
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
