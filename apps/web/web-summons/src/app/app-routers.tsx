import { Route, Routes } from 'react-router-dom';
import { Component } from 'react';
import {
  CreateUser,
  LoginContainer,
  ProtectedLayout,
} from '@workspaces/feature';

class AppRouters extends Component {
  render() {
    return (
      <Routes>
        <Route
          path="/login"
          element={
            <LoginContainer
              cardImage="/assets/svg/login-image.svg"
              logo="/assets/png/summons-image.png"
            />
          }
        />

        <Route
          path="/register"
          element={
            <CreateUser
              cardImage="/assets/svg/create-user.svg"
              logo="/assets/png/summons-image.png"
            />
          }
        />

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
