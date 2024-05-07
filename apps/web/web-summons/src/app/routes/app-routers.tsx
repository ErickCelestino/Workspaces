import { Navigate, Route, Routes } from 'react-router-dom';
import {
  EditUserContainer,
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
        label: 'Editar Usuário',
        icon: 'edit',
        path: '/edit-user',
      },
    ]);
  }, [setDrawerOptions]);

  return (
    <Routes>
      <Route path="/home" element={<TestContainer />} />
      <Route path="/edit-user" element={<EditUserContainer />} />

      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
};
