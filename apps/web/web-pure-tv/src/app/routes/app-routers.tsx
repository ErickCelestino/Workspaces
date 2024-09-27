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
  useLoggedUser,
  useLoadUserPureTvData,
} from '@workspaces/feature';
import { useEffect, useRef } from 'react';

export const AppRouters = () => {
  const { loggedUser } = useLoggedUser();
  const loadedData = useLoadUserPureTvData();
  const hasLoadedUserData = useRef(false);

  useEffect(() => {
    if (loggedUser?.id && !hasLoadedUserData.current) {
      loadedData();
      hasLoadedUserData.current = true;
    }
  }, [loggedUser, loadedData]);

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
