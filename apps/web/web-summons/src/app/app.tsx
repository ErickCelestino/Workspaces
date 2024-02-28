import { Component } from 'react';
import './app.scss';
import AppRouters from './app-routers';
import { AuthProvider } from '@workspaces/feature';

class App extends Component {
  render() {
    return (
      <div>
        <AuthProvider>
          <AppRouters />
        </AuthProvider>
      </div>
    );
  }
}

export default App;
