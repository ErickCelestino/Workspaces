import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './app/app';
import { AppNameProvider } from '@workspaces/feature';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const appName = 'Summons';
root.render(
  <StrictMode>
    <BrowserRouter>
      <AppNameProvider appName={appName}>
        <App />
      </AppNameProvider>
    </BrowserRouter>
  </StrictMode>
);
