import { Navigate, Route, Routes } from 'react-router-dom';
import {
  EditUserContainer,
  ListUserContainer,
  TestContainer,
  useDrawerContext,
  ListContanteFilesContainer,
  CreatePlaylistCategoryContainer,
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
        label: 'Usuários',
        icon: 'list',
        path: '/list-user',
      },
      {
        label: 'Arquivos',
        icon: 'folder',
        path: '/files',
      },
      {
        label: 'Playlists',
        icon: 'playlist_add',
        path: '/playlist',
      },
    ]);
  }, [setDrawerOptions]);

  return (
    <Routes>
      <Route path="/home" element={<TestContainer />} />
      <Route path="/edit-user" element={<EditUserContainer />} />
      <Route path="list-user" element={<ListUserContainer />} />
      <Route path="files" element={<ListContanteFilesContainer />} />
      <Route path="playlist" element={<CreatePlaylistCategoryContainer />} />

      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
};
