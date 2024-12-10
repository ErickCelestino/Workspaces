import { TestContainer } from '@workspaces/feature';
import { Route, Routes } from 'react-router-dom';

export const AppRouters = () => {
  return (
    <Routes>
      <Route path="/" element={<TestContainer />} />
    </Routes>
  );
};
