import { Box, Grid, Icon, useTheme } from '@mui/material';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import {
  ToolbarPureTV,
  PlaylistCard,
  EmptyListResponse,
  PlaylistModals,
} from '../../components';
import { LayoutBase } from '../../layout';
import { usePlaylistData, useSnackbarAlert } from '../../hooks';
import { useCallback, useEffect, useState } from 'react';
import { CrudType, IconMenuItem } from '@workspaces/domain';
import { useLoggedUser } from '../../contexts';
import { ContainerCardList } from '../utils';

export const ListPlaylistContainer = () => {
  const { loggedUser } = useLoggedUser();
  const theme = useTheme();
  const { showSnackbarAlert, SnackbarAlert } = useSnackbarAlert();
  const [selectedId, setSelectedId] = useState<string>('');
  const [openModal, setOpenModal] = useState({
    create: false,
    delete: false,
    edit: false,
    details: false,
    add: false,
  });
  const [isMounted, setIsMounted] = useState(false);

  const showAlert = useCallback(
    (message: string, success: boolean) => {
      showSnackbarAlert({
        message: message,
        severity: success ? 'success' : 'error',
      });
    },
    [showSnackbarAlert]
  );

  const { listPlaylist, totalPage, getData } = usePlaylistData({
    showAlert,
    loggedUserId: loggedUser?.id ?? '',
    companyId: loggedUser?.selectedCompany.id ?? '',
  });

  const handlePopUpOpen = async (type: CrudType | 'add', id?: string) => {
    setSelectedId(id ?? '');
    setOpenModal((prev) => ({
      ...prev,
      [type]: true,
    }));
  };

  const handlePopUpClose = async (type: CrudType | 'add') => {
    setOpenModal((prev) => ({
      ...prev,
      [type]: false,
    }));
    getData();
  };

  useEffect(() => {
    setIsMounted(false);
  }, [loggedUser?.selectedCompany.id]);

  useEffect(() => {
    if (!isMounted) {
      getData();
      setIsMounted(true);
    }
  }, [isMounted]);

  const rightClickMenuList: IconMenuItem[] = [
    {
      icon: <Icon>playlist_add</Icon>,
      title: 'Nova Playlist',
      handleClick: async () => handlePopUpOpen('create'),
    },
  ];

  const searchData = async (input: string) => {
    getData(input);
  };

  const handleChange = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    getData('', value);
  };

  const renderPlaylist = () =>
    listPlaylist.length > 0 ? (
      listPlaylist.map((playlist, index) =>
        listPlaylist.map((playlist) => (
          <Grid item key={playlist.id}>
            <PlaylistCard
              editPlaylist={() => handlePopUpOpen('edit', playlist.id)}
              deletePlaylist={() => handlePopUpOpen('delete', playlist.id)}
              addFile={() => handlePopUpOpen('add', playlist.id)}
              detailsPlaylist={() => handlePopUpOpen('details', playlist.id)}
              idPlaylist={playlist.id}
              name={playlist.name}
              showAlert={showAlert}
            />
          </Grid>
        ))
      )
    ) : (
      <EmptyListResponse
        message="Sem Playlists"
        icon={
          <PlaylistRemoveIcon
            sx={{
              fontSize: theme.spacing(10),
            }}
          />
        }
      />
    );

  return (
    <>
      <PlaylistModals
        companyId={loggedUser?.selectedCompany.id ?? ''}
        selectedId={selectedId}
        openModal={openModal}
        handlePopUpClose={handlePopUpClose}
        showAlert={showAlert}
      />
      <LayoutBase
        title="Listagem Playlist"
        iconMenuItemList={rightClickMenuList}
        toolBar={<ToolbarPureTV />}
      >
        <ContainerCardList
          handleChange={handleChange}
          search={{
            searchData: searchData,
            placeholder: 'Pesquisar Playlist',
            createPopUp: () => handlePopUpOpen('create'),
          }}
          totalPage={totalPage}
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
          >
            <Grid container display="flex" justifyContent="center" spacing={2}>
              {renderPlaylist()}
            </Grid>
          </Box>
        </ContainerCardList>
      </LayoutBase>
      {SnackbarAlert}
    </>
  );
};
