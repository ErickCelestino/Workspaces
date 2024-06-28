import { Box } from '@mui/material';
import {
  CreatePlaylistCategoryModal,
  ListPlaylistCategory,
  ToolbarPureTV,
} from '../../../components';
import { LayoutBase } from '../../../layout';
import { useCallback, useEffect, useState } from 'react';
import { useSnackbarAlert } from '../../../hooks';
import {
  ErrorResponse,
  ListPlaylistCategoryReponseDto,
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
  const [createCategoryPopUp, setCreateCategoryPopUp] = useState(false);
  const { showSnackbarAlert, SnackbarAlert } = useSnackbarAlert();

  const showAlert = useCallback(
    (message: string, success: boolean) => {
      showSnackbarAlert({
        message: message,
        severity: success ? 'success' : 'error',
      });
    },
    [showSnackbarAlert]
  );

  const getListPlaylistCategory = useCallback(async () => {
    try {
      const result = await ListPlaylistCategoryRequest({
        loggedUserId: loggedUser?.id ?? '',
        userInput: '',
      });
      setListPlaylistCategory(result.categories);
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
  }, [showAlert]);

  useEffect(() => {
    getListPlaylistCategory();
  }, [getListPlaylistCategory]);

  const handlePopUpClose = (types: PlaylistCategoryType) => {
    switch (types) {
      case 'create':
        setCreateCategoryPopUp(false);
        break;
    }
  };

  const handlePopUpOpen = (types: PlaylistCategoryType) => {
    switch (types) {
      case 'create':
        setCreateCategoryPopUp(true);
        break;
    }
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
        <Box>
          <ListPlaylistCategory list={listPlaylistCategory} />
        </Box>
      </LayoutBase>
      {SnackbarAlert}
    </>
  );
};
