import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDrawerContext, useLoggedUser } from '@workspaces/feature';
import { useLoading } from '../../contexts';

export const useLoadUserData = () => {
  const { loggedUser } = useLoggedUser();
  const { setDrawerOptions } = useDrawerContext();
  const { setIsLoading } = useLoading();
  const navigate = useNavigate();

  useEffect(() => {
    setDrawerOptions({});
    setIsLoading(true);

    if (loggedUser?.status !== 'BLOCKED') {
      navigate('/');
      const drawerOptions = {
        'Página Inicial': [
          { label: 'Página Inicial', icon: 'home', path: '/home' },
        ],
        Diretorios: [
          { label: 'Diretórios', icon: 'folder', path: '/directory' },
        ],
        Playlists: [
          { label: 'Playlists', icon: 'playlist_add', path: '/playlist' },
          { label: 'Categorias', icon: 'category', path: '/playlist-category' },
        ],
        Agendamentos: [
          {
            label: 'Agendamentos',
            icon: 'event_upcoming',
            path: '/scheduling',
          },
        ],
        Dispositivos: [
          { label: 'Dispositivos', icon: 'important_devices', path: '/device' },
        ],
      };

      if (loggedUser?.type === 'DEFAULT_ADMIN') {
        setDrawerOptions({
          ...drawerOptions,
          Empresa: [
            { label: 'Empresas', icon: 'add_business', path: '/company' },
          ],
        });
      } else if (loggedUser?.type === 'ADMIN') {
        setDrawerOptions({
          ...drawerOptions,
          Empresa: [
            { label: 'Empresas', icon: 'add_business', path: '/company' },
          ],
          Usuários: [
            { label: 'Usuários', icon: 'manage_accounts', path: '/user' },
          ],
        });
      } else {
        setDrawerOptions(drawerOptions);
      }
    } else {
      setDrawerOptions({});
      navigate('/unauthorized-access');
    }

    setIsLoading(false);
  }, [loggedUser, navigate, setDrawerOptions, setIsLoading]);

  return;
};
