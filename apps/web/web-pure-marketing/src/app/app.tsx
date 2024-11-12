import { AppThemeProvider } from '@workspaces/feature';
import './app.scss';
import { AppRouters } from './routes/app-routers';

export function App() {
  return (
    <AppThemeProvider>
      <AppRouters />
    </AppThemeProvider>
  );
}

export default App;
