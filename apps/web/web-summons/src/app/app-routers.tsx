import { Route, Routes } from 'react-router-dom';
import { Component } from 'react';
import { Teste, LoginContainer } from '@workspaces/feature';

class AppRouters extends Component {
  render() {
    return (
      <Routes>
        <Route path="/login" element={<LoginContainer />} />

        <Route path="/" element={<Teste />} />
      </Routes>
    );
  }
}

export default AppRouters;
