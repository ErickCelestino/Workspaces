import './app.scss';
import { AppRouters, AuthRouters } from './routes';
import {
  AppThemeProvider,
  DrawerProvider,
  LoggedUserProvider,
  MiniDrawer,
  useAuth,
} from '@workspaces/feature';

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
