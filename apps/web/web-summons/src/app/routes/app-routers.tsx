import { Navigate, Route, Routes } from 'react-router-dom';
import {
  CreateUser,
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
        label: 'teste',
        icon: 'house',
        path: '/teste1',
      },
    ]);
  }, [setDrawerOptions]);

  return (
    <Routes>
      <Route path="/home" element={<TestContainer />} />

      <Route
        path="/register"
        element={
          <CreateUser
            cardImage="/assets/svg/create-user.svg"
            logo="/assets/png/summons-image.png"
          />
        }
      />

      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
};
