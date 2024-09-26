import { Navigate, Route, Routes } from 'react-router-dom';
import {
  ListUserContainer,
  TestContainer,
  ListContanteFilesContainer,
  ListPlaylistContainer,
  ListPlaylistCategoryContainer,
  ListDirectoryContainer,
  ListSchedulesContainer,
  ListDeviceContainer,
  ListCompanyContainer,
  UnauthorizedUserContainer,
} from '@workspaces/feature';

export const AppRouters = () => {
  return (
    <Routes>
      <Route path="/home" element={<TestContainer />} />
      <Route path="user" element={<ListUserContainer />} />
      <Route path="/files" element={<ListContanteFilesContainer />} />
      <Route path="/directory" element={<ListDirectoryContainer />} />
      <Route path="playlist" element={<ListPlaylistContainer />} />
      <Route
        path="playlist-category"
        element={<ListPlaylistCategoryContainer />}
      />
      <Route path="scheduling" element={<ListSchedulesContainer />} />
      <Route path="device" element={<ListDeviceContainer />} />
      <Route path="company" element={<ListCompanyContainer />} />
      <Route
        path="unauthorized-access"
        element={<UnauthorizedUserContainer />}
      />

      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
};
