import { Navigate, Route, Routes } from 'react-router-dom';
import { TestContainer, useDrawerContext } from '@workspaces/feature';
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
    ]);
  }, [setDrawerOptions]);

  return (
    <Routes>
      <Route path="/home" element={<TestContainer />} />

      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
};
