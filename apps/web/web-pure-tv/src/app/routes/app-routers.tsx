import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import {
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
  ListCompanyContainer,
  UnauthorizedUserContainer,
} from '@workspaces/feature';
import { useEffect, useState } from 'react';

export const AppRouters = () => {
  const { loggedUser } = useLoggedUser();
  const { setDrawerOptions } = useDrawerContext();
  const navigate = useNavigate();
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (!loggedUser?.id) {
      setDataLoaded(false);
    }
  }, [loggedUser?.id, dataLoaded]);

  useEffect(() => {
    if (!dataLoaded) {
      if (loggedUser?.status !== 'BLOCKED') {
        navigate('/');
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

        loggedUser?.type === 'DEFAULT_ADMIN'
          ? setDrawerOptions({
              ...drawerOptions,
              Empresa: [
                {
                  label: 'Empresas',
                  icon: 'add_business',
                  path: '/company',
                },
              ],
            })
          : loggedUser?.type === 'ADMIN'
          ? setDrawerOptions({
              ...drawerOptions,
              Empresa: [
                {
                  label: 'Empresas',
                  icon: 'add_business',
                  path: '/company',
                },
              ],
              Usuários: [
                {
                  label: 'Usuários',
                  icon: 'manage_accounts',
                  path: '/user',
                },
              ],
            })
          : setDrawerOptions(drawerOptions);
      } else {
        navigate('/unauthorized-access');
      }
      setDataLoaded(true);
    }
  }, [setDrawerOptions, loggedUser, dataLoaded]);

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
