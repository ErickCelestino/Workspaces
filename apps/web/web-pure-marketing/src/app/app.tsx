import { AppThemeProvider, DrawerProvider } from '@workspaces/feature';
import './app.scss';
import { AppRouters } from './routes/app-routers';

export function App() {
  return (
    <AppThemeProvider>
      <DrawerProvider>
        <AppRouters />
      </DrawerProvider>
    </AppThemeProvider>
  );
}

export default App;
