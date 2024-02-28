import { Route, Routes } from 'react-router-dom';
import { Component } from 'react';
import { LoginContainer, ProtectedLayout } from '@workspaces/feature';

class AppRouters extends Component {
  render() {
    return (
      <Routes>
        <Route path="/login" element={<LoginContainer />} />

        <Route
          path="/"
          element={
            <ProtectedLayout>
              <h2>Olá esse é o componente de teste</h2>
            </ProtectedLayout>
          }
        />
      </Routes>
    );
  }
}

export default AppRouters;
