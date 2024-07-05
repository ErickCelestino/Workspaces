import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './app/app';
import { AppIdProvider, AuthProvider } from '@workspaces/feature';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const appId = process.env['NX_APP_PURE_TV_ID'] || '';
root.render(
  <StrictMode>
    <BrowserRouter>
      <AppIdProvider appId={appId}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </AppIdProvider>
    </BrowserRouter>
  </StrictMode>
);
