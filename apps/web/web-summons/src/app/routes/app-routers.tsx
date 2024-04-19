import { Navigate, Route, Routes } from 'react-router-dom';
import {
  CreateCompanyContainer,
  TestContainer,
  useDrawerContext,
} from '@workspaces/feature';
import { useEffect } from 'react';

export const AppRouters = () => {
  const { setDrawerOptions } = useDrawerContext();

  useEffect(() => {
    setDrawerOptions([
      {
        label: 'Página Inicial',
        icon: 'home',
        path: '/home',
      },
      {
        label: 'Criar Empresa',
        icon: 'add_business',
        path: '/create-company',
      },
    ]);
  }, [setDrawerOptions]);

  return (
    <Routes>
      <Route path="/home" element={<TestContainer />} />

      <Route path="/create-company" element={<CreateCompanyContainer />} />

      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
};
