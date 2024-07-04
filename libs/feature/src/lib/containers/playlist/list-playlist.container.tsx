import {
  Box,
  Grid,
  IconButton,
  Pagination,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  CreatePlaylistModal,
  SearchBar,
  ToolbarPureTV,
  PlaylistCard,
} from '../../components';
import { LayoutBase } from '../../layout';
import { useSnackbarAlert } from '../../hooks';
import { useCallback, useEffect, useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
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

export const ListPlaylistContainer = () => {
  const { showSnackbarAlert, SnackbarAlert } = useSnackbarAlert();
  const { loggedUser } = useLoggedUser();
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));
  const mdDown = useMediaQuery(theme.breakpoints.down('md'));

  const [createPlaylistPopUp, setCreatePlaylistPopUp] = useState(false);
  const [search, setSearch] = useState(false);
  const [listPlaylist, setListPlaylist] = useState<Playlist[]>([]);
  const [totalPage, setTotalPage] = useState<number>(1);

  const handlePopUpClose = (types: CrudType) => {
    switch (types) {
      case 'create':
        setCreatePlaylistPopUp(false);
        break;
      case 'edit':
        //need implementation
        break;
      case 'delete':
        //need implementation
        break;
    }
  };

  const handlePopUpOpen = (types: CrudType, id?: string) => {
    switch (types) {
      case 'create':
        setCreatePlaylistPopUp(true);
        break;
      case 'edit':
        //need implementation
        break;
      case 'delete':
        //need implementation
        break;
      case 'details':
        //need implementation
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
      <LayoutBase title="Listagem Playlist" toolBar={<ToolbarPureTV />}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <Box width="95%">
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  justifyContent: 'center',
                  width: mdUp ? '55%' : smDown ? '80%' : mdDown ? '95%' : '80%',
                  marginLeft: theme.spacing(2),
                }}
              >
                <SearchBar
                  onSearch={searchData}
                  placeholder="Pesquisar Playlist"
                />
              </Box>
              <IconButton
                onClick={() => handlePopUpOpen('create')}
                sx={{
                  width: theme.spacing(8),
                  height: theme.spacing(8),
                  marginLeft: theme.spacing(2),
                }}
              >
                <AddCircleIcon
                  sx={{
                    width: theme.spacing(8),
                    height: theme.spacing(8),
                  }}
                  color="primary"
                  fontSize="large"
                />
              </IconButton>
            </Box>
          </Box>

          <Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Box
                display="flex"
                justifyContent="center"
                mt={theme.spacing(2)}
                sx={{
                  width: mdUp ? '92%' : smDown ? '94%' : mdDown ? '95%' : '80%',
                }}
              >
                {listPlaylist.length > 0 ? (
                  <Grid justifyContent="center" container spacing={2}>
                    {listPlaylist.map((file, index) => (
                      <Grid item md={6} lg={4} key={index}>
                        <PlaylistCard
                          deletePlaylist={async () => handlePopUpOpen('delete')}
                          detailsPlaylist={async () =>
                            handlePopUpOpen('details')
                          }
                          imageData={{
                            image: '',
                            imageName: '',
                          }}
                          name={file.name}
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
              </Box>
              <Box
                marginTop={theme.spacing(2)}
                display="flex"
                justifyContent="end"
              >
                <Pagination
                  count={totalPage}
                  color="primary"
                  onChange={handleChange}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </LayoutBase>
      {SnackbarAlert}
    </>
  );
};
