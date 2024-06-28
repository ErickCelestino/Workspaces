import { Box, Pagination, useTheme } from '@mui/material';
import {
  CreatePlaylistCategoryModal,
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
  PlaylistCategoryType,
} from '@workspaces/domain';
import { ListPlaylistCategoryRequest } from '../../../services';
import { useLoggedUser } from '../../../contexts';
import axios, { AxiosError } from 'axios';
import { ValidationsError } from '../../../shared';

export const ListPlaylistCategoryContainer = () => {
  const { loggedUser } = useLoggedUser();
  const [listPlaylistCategory, setListPlaylistCategory] = useState<
    PlaylistCategory[]
  >([]);
  const [search, setSearch] = useState(false);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [createCategoryPopUp, setCreateCategoryPopUp] = useState(false);
  const { showSnackbarAlert, SnackbarAlert } = useSnackbarAlert();
  const theme = useTheme();

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
  }, [getData]);

  const searchData = async (input: string) => {
    setSearch(true);
    const result = await handleData({
      loggedUserId: loggedUser?.id ?? '',
      userInput: input,
    });

    setTotalPage(result?.totalPages ?? 0);
    setListPlaylistCategory(result?.categories ?? []);
  };

  const handlePopUpClose = (types: PlaylistCategoryType) => {
    switch (types) {
      case 'create':
        setCreateCategoryPopUp(false);
        break;
    }
  };

  const handleChange = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    const result = await ListPlaylistCategoryRequest({
      userInput: '',
      loggedUserId: loggedUser?.id ?? '',
      skip: (value - 1) * 8,
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
      <LayoutBase title="Listagem Playlist" toolBar={<ToolbarPureTV />}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box width="95%">
            <SearchBar
              onSearch={searchData}
              placeholder="Pesquisar Categoria"
            />
            <ListPlaylistCategory list={listPlaylistCategory} />
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
