import {
  Box,
  IconButton,
  List,
  Pagination,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {
  CreatePlaylistCategoryModal,
  DeletePlaylistCategoryModal,
  EditPlaylistCategoryModal,
  ListPlaylistCategory,
  SearchBar,
  ToolbarPureTV,
} from '../../../components';
import { LayoutBase } from '../../../layout';
import { useCallback, useEffect, useState } from 'react';
import { useSnackbarAlert } from '../../../hooks';
import {
  ErrorResponse,
  ListPlaylistCategoryDto,
  PlaylistCategory,
  CrudType,
} from '@workspaces/domain';
import { ListPlaylistCategoryRequest } from '../../../services';
import { useLoggedUser } from '../../../contexts';
import axios, { AxiosError } from 'axios';
import { ValidationsError } from '../../../shared';
import { ScrollBox } from '../../../components/scroll';

export const ListPlaylistCategoryContainer = () => {
  const { loggedUser } = useLoggedUser();
  const [listPlaylistCategory, setListPlaylistCategory] = useState<
    PlaylistCategory[]
  >([]);
  const [playlistCategoryId, setPlaylistCategoryId] = useState('');
  const [search, setSearch] = useState(false);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [createCategoryPopUp, setCreateCategoryPopUp] = useState(false);
  const [editCategoryPopUp, setEditCategoryPopUp] = useState(false);
  const [deleteCategoryPopUp, setDeleteCategoryPopUp] = useState(false);
  const { showSnackbarAlert, SnackbarAlert } = useSnackbarAlert();
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

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
    async (data: ListPlaylistCategoryDto) => {
      try {
        const result = await ListPlaylistCategoryRequest({
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
          const errors = ValidationsError(axiosError, 'Categorias');
          if (errors) {
            showAlert(errors, false);
          }
        }
      }
    },
    [showAlert]
  );

  const getData = useCallback(async () => {
    const result = await handleData({
      loggedUserId: loggedUser?.id ?? '',
      userInput: '',
    });
    setTotalPage(result?.totalPages ?? 0);
    setListPlaylistCategory(result?.categories ?? []);
  }, [loggedUser, handleData]);

  useEffect(() => {
    if (!search) {
      getData();
    }
  }, [getData, search]);

  const searchData = async (input: string) => {
    setSearch(true);
    const result = await handleData({
      loggedUserId: loggedUser?.id ?? '',
      userInput: input,
    });

    setTotalPage(result?.totalPages ?? 0);
    setListPlaylistCategory(result?.categories ?? []);
  };

  const handlePopUpClose = (types: CrudType) => {
    switch (types) {
      case 'create':
        setCreateCategoryPopUp(false);
        break;
      case 'edit':
        setEditCategoryPopUp(false);
        break;
      case 'delete':
        setDeleteCategoryPopUp(false);
    }
  };

  const handlePopUpOpen = (types: CrudType, id?: string) => {
    switch (types) {
      case 'create':
        setCreateCategoryPopUp(true);
        break;
      case 'edit':
        setPlaylistCategoryId(id ?? '');
        setEditCategoryPopUp(true);
        break;
      case 'delete':
        setPlaylistCategoryId(id ?? '');
        setDeleteCategoryPopUp(true);
    }
  };

  const handleChange = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setSearch(true);
    const result = await ListPlaylistCategoryRequest({
      userInput: '',
      loggedUserId: loggedUser?.id ?? '',
      skip: (value - 1) * 6,
    });
    setTotalPage(result.totalPages);
    setListPlaylistCategory(result.categories);
  };

  return (
    <>
      <CreatePlaylistCategoryModal
        showAlert={showAlert}
        handlePopUpClose={() => handlePopUpClose('create')}
        open={createCategoryPopUp}
        title="Registrar Nova Categoria"
      />
      <EditPlaylistCategoryModal
        selectedId={playlistCategoryId}
        showAlert={showAlert}
        handlePopUpClose={() => handlePopUpClose('edit')}
        open={editCategoryPopUp}
        title="Editar Categoria"
      />
      <DeletePlaylistCategoryModal
        selectedId={playlistCategoryId}
        showAlert={showAlert}
        handlePopUpClose={() => handlePopUpClose('delete')}
        open={deleteCategoryPopUp}
        title="Deletar Categoria?"
        subTitle="Por favor, selecione alguma das alternativas"
      />
      <LayoutBase title="Listagem Playlist" toolBar={<ToolbarPureTV />}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
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
                width={smDown ? '100%' : '55%'}
                marginRight={theme.spacing(2)}
              >
                <SearchBar
                  onSearch={searchData}
                  placeholder="Pesquisar Categoria"
                />
              </Box>
              <IconButton
                onClick={() => handlePopUpOpen('create')}
                sx={{
                  width: theme.spacing(8),
                  height: theme.spacing(8),
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
                width={smDown ? '100%' : '60%'}
                sx={{
                  marginLeft: smDown ? -3 : '',
                }}
              >
                <ScrollBox maxHeight="100%">
                  <List>
                    {listPlaylistCategory.map((category) => (
                      <ListPlaylistCategory
                        key={category.id}
                        editPlaylistCategory={async () =>
                          handlePopUpOpen('edit', category.id)
                        }
                        deletePlaylistCategory={async () =>
                          handlePopUpOpen('delete', category.id)
                        }
                        category={category}
                      />
                    ))}
                  </List>
                </ScrollBox>
              </Box>
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
      </LayoutBase>
      {SnackbarAlert}
    </>
  );
};
