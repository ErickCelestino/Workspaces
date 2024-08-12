import { Navigate, Route, Routes } from 'react-router-dom';
import {
  EditUserContainer,
  ListUserContainer,
  TestContainer,
  useDrawerContext,
  ListContanteFilesContainer,
  ListPlaylistContainer,
  ListPlaylistCategoryContainer,
  ListDirectoryContainer,
  ListSchedulesContainer,
  ListDeviceContainer,
} from '@workspaces/feature';
import { useEffect } from 'react';

export const AppRouters = () => {
  const { setDrawerOptions } = useDrawerContext();

  useEffect(() => {
    setDrawerOptions({
      'Página Inicial': [
        {
          label: 'Página Inicial',
          icon: 'home',
          path: '/home',
        },
      ],
      Usuários: [
        {
          label: 'Usuários',
          icon: 'list',
          path: '/list-user',
        },
      ],
      // Arquivos: [
      //   {
      //     label: 'Arquivos',
      //     icon: 'folder',
      //     path: '/files',
      //   },
      // ],
      Diretorios: [
        {
          label: 'Diretórios',
          icon: 'folder',
          path: '/directory',
        },
      ],
      Playlists: [
        {
          label: 'Playlists',
          icon: 'playlist_add',
          path: '/playlist',
        },
        {
          label: 'Categorias',
          icon: 'category',
          path: '/playlist-category',
        },
      ],
      Agendamentos: [
        {
          label: 'Agendamentos',
          icon: 'event_upcoming',
          path: '/scheduling',
        },
      ],
      Dispositivos: [
        {
          label: 'Dispositivos',
          icon: 'important_devices',
          path: '/device',
        },
      ],
    });
  }, [setDrawerOptions]);

  return (
    <Routes>
      <Route path="/home" element={<TestContainer />} />
      <Route path="/edit-user" element={<EditUserContainer />} />
      <Route path="list-user" element={<ListUserContainer />} />
      <Route path="/files" element={<ListContanteFilesContainer />} />
      <Route path="/directory" element={<ListDirectoryContainer />} />
      <Route path="playlist" element={<ListPlaylistContainer />} />
      <Route
        path="playlist-category"
        element={<ListPlaylistCategoryContainer />}
      />
      <Route path="scheduling" element={<ListSchedulesContainer />} />
      <Route path="device" element={<ListDeviceContainer />} />

      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
};
