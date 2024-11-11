import { Navigate, Route, Routes } from 'react-router-dom';
import { TestContainer } from '@workspaces/feature';

export const AppRouters = () => {
  return (
    <Routes>
      <Route path="/" element={<TestContainer />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
