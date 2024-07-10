import { Box, Grid, Typography, useTheme } from '@mui/material';
import {
  CreatePlaylistModal,
  ToolbarPureTV,
  PlaylistCard,
  DeletePlaylistModal,
  ContainerCardList,
  AddFileToPlaylistModal,
} from '../../components';
import { LayoutBase } from '../../layout';
import { useSnackbarAlert } from '../../hooks';
import { useCallback, useEffect, useState } from 'react';
import {
  CrudType,
  ErrorResponse,
  ListPlaylistDto,
  Playlist,
} from '@workspaces/domain';
import { ListPlaylistRequest } from '../../services';
import axios, { AxiosError } from 'axios';
import { ValidationsError } from '../../shared';
import { useLoggedUser } from '../../contexts';
import { EditPlaylistModal } from '../../components/modal/playlist/edit-playlist-modal';

export const ListPlaylistContainer = () => {
  const { showSnackbarAlert, SnackbarAlert } = useSnackbarAlert();
  const { loggedUser } = useLoggedUser();
  const theme = useTheme();

  const [createPlaylistPopUp, setCreatePlaylistPopUp] = useState(false);
  const [editPlaylistPopUp, setEditPlaylistPopUp] = useState(false);
  const [deletePlaylistPopUp, setDeletePlaylistPopUp] = useState(false);
  const [addFilePopUp, setAddFilePopUp] = useState(false);
  const [search, setSearch] = useState(false);
  const [listPlaylist, setListPlaylist] = useState<Playlist[]>([]);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [playlistId, setPlaylistId] = useState('');

  const handlePopUpClose = (types: CrudType | 'add-file') => {
    switch (types) {
      case 'create':
        setCreatePlaylistPopUp(false);
        break;
      case 'edit':
        setEditPlaylistPopUp(false);
        break;
      case 'delete':
        setDeletePlaylistPopUp(false);
        break;
      case 'add-file':
        setAddFilePopUp(false);
        break;
    }
  };

  const handlePopUpOpen = (types: CrudType | 'add-file', id?: string) => {
    switch (types) {
      case 'create':
        setCreatePlaylistPopUp(true);
        break;
      case 'edit':
        setPlaylistId(id ?? '');
        setEditPlaylistPopUp(true);
        break;
      case 'delete':
        setPlaylistId(id ?? '');
        setDeletePlaylistPopUp(true);
        break;
      case 'add-file':
        setPlaylistId(id ?? '');
        setAddFilePopUp(true);
        break;
    }
  };

  const showAlert = useCallback(
    (message: string, success: boolean) => {
      showSnackbarAlert({
        message: message,
        severity: success ? 'success' : 'error',
      });
    },
    [showSnackbarAlert]
  );

  const handleData = useCallback(
    async (data: ListPlaylistDto) => {
      try {
        const result = await ListPlaylistRequest({
          loggedUserId: data.loggedUserId,
          userInput: data.userInput,
          skip: data.skip,
          take: data.take,
        });
        return result;
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ErrorResponse>;
          const errors = ValidationsError(axiosError, 'Playlist');
          if (errors) {
            showAlert(errors, false);
          }
        }
      }
    },
    [showAlert]
  );

  const searchData = async (input: string) => {
    setSearch(true);
    const result = await handleData({
      loggedUserId: loggedUser?.id ?? '',
      userInput: input,
    });

    setTotalPage(result?.totalPages ?? 0);
    setListPlaylist(result?.playlists ?? []);
  };

  const handleChange = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setSearch(true);
    const result = await ListPlaylistRequest({
      userInput: '',
      loggedUserId: loggedUser?.id ?? '',
      skip: (value - 1) * 6,
    });
    setTotalPage(result.totalPages);
    setListPlaylist(result.playlists);
  };

  const getData = useCallback(async () => {
    const result = await handleData({
      loggedUserId: loggedUser?.id ?? '',
      userInput: '',
    });
    setTotalPage(result?.totalPages ?? 0);
    setListPlaylist(result?.playlists ?? []);
  }, [loggedUser, handleData]);

  useEffect(() => {
    if (!search) {
      getData();
    }
  }, [getData, search]);

  return (
    <>
      <CreatePlaylistModal
        handlePopUpClose={() => handlePopUpClose('create')}
        showAlert={showAlert}
        open={createPlaylistPopUp}
        title="Criar Playlist"
      />
      <EditPlaylistModal
        idToEdit={playlistId}
        handlePopUpClose={() => handlePopUpClose('edit')}
        showAlert={showAlert}
        open={editPlaylistPopUp}
        title="Editar Playlist"
      />
      <DeletePlaylistModal
        idToDelete={playlistId}
        handlePopUpClose={() => handlePopUpClose('delete')}
        showAlert={showAlert}
        open={deletePlaylistPopUp}
        title="Deletar Playlist?"
        subTitle="Por favor, selecione alguma das alternativas"
      />
      <AddFileToPlaylistModal
        idPlaylist={playlistId}
        open={addFilePopUp}
        showAlert={showAlert}
        handlePopUpClose={() => handlePopUpClose('add-file')}
        title="Adicionar Arquivos a Playlist?"
      />
      <LayoutBase title="Listagem Playlist" toolBar={<ToolbarPureTV />}>
        <ContainerCardList
          handleChange={handleChange}
          search={{
            searchData: searchData,
            placeholder: 'Pesquisar Playlist',
            createPopUp: () => handlePopUpOpen('create'),
          }}
          totalPage={totalPage}
        >
          {listPlaylist.length > 0 ? (
            <Grid justifyContent="center" container spacing={2}>
              {listPlaylist.map((playlist, index) => (
                <Grid item md={6} lg={4} xl={3} key={index}>
                  <PlaylistCard
                    editPlaylist={async () =>
                      handlePopUpOpen('edit', playlist.id)
                    }
                    deletePlaylist={async () =>
                      handlePopUpOpen('delete', playlist.id)
                    }
                    addFile={async () =>
                      handlePopUpOpen('add-file', playlist.id)
                    }
                    imageData={{
                      image: '',
                      imageName: '',
                    }}
                    name={playlist.name}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box
              marginTop={theme.spacing(2)}
              width="100%"
              display="flex"
              justifyContent="center"
            >
              <Typography variant="h4">
                Não foram encontrados registros
              </Typography>
            </Box>
          )}
        </ContainerCardList>
      </LayoutBase>
      {SnackbarAlert}
    </>
  );
};
