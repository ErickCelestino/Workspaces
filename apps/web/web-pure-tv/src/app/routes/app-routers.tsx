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
  useLoggedUser,
} from '@workspaces/feature';
import { useEffect } from 'react';

export const AppRouters = () => {
  const { loggedUser } = useLoggedUser();
  const { setDrawerOptions } = useDrawerContext();

  useEffect(() => {
    const drawerOptions = {
      'Página Inicial': [
        {
          label: 'Página Inicial',
          icon: 'home',
          path: '/home',
        },
      ],
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
    };
    loggedUser?.type === 'ADMIN'
      ? setDrawerOptions({
          ...drawerOptions,
          Usuários: [
            {
              label: 'Usuários',
              icon: 'list',
              path: '/list-user',
            },
          ],
        })
      : setDrawerOptions(drawerOptions);
  }, [setDrawerOptions, loggedUser]);

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
