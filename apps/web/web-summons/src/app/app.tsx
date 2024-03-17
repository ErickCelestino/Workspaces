import { Component } from 'react';
import './app.scss';
import AppRouters from './app-routers';
import { AppThemeProvider, AuthProvider } from '@workspaces/feature';

class App extends Component {
  render() {
    return (
      <div>
        <AuthProvider>
          <AppThemeProvider>
            <AppRouters />
          </AppThemeProvider>
        </AuthProvider>
      </div>
    );
  }
}

export default App;
