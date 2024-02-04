import { Route, Routes } from 'react-router-dom';
import { Component } from 'react';
import { Teste } from '@workspaces/feature';

class AppRouters extends Component {
  render() {
    return (
      <Routes>
        <Route path="/teste" element={<Teste />} />

        <Route path="/" element={<Teste />} />
      </Routes>
    );
  }
}

export default AppRouters;
