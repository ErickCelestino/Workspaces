import { Navigate, Route, Routes } from 'react-router-dom';
import { PreRegistrationContainer } from '@workspaces/feature';

export const AppRouters = () => {
  return (
    <Routes>
      <Route path="/" element={<PreRegistrationContainer />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
