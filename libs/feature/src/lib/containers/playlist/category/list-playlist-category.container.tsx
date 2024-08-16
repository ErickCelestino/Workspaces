import { Icon, List, useTheme } from '@mui/material';
import DoNotTouchIcon from '@mui/icons-material/DoNotTouch';
import {
  CreatePlaylistCategoryModal,
  DeletePlaylistCategoryModal,
  EditPlaylistCategoryModal,
  EmptyListResponse,
  PlaylistCategoryItem,
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
  IconMenuItem,
} from '@workspaces/domain';
import { ListPlaylistCategoryRequest } from '../../../services';
import { useLoggedUser } from '../../../contexts';
import axios, { AxiosError } from 'axios';
import { ValidationsError } from '../../../shared';
import { ContainerSimpleList } from '../../utils';

export const ListPlaylistCategoryContainer = () => {
  const { loggedUser } = useLoggedUser();
  const theme = useTheme();

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

  const rightClickMenuList: IconMenuItem[] = [
    {
      icon: <Icon>category</Icon>,
      title: 'Nova Categoria',
      handleClick: async () => handlePopUpOpen('create'),
    },
  ];

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
      <LayoutBase
        title="Listagem de Categoria da Playlist"
        iconMenuItemList={rightClickMenuList}
        toolBar={<ToolbarPureTV />}
      >
        <ContainerSimpleList
          handleChange={handleChange}
          search={{
            placeholder: 'Buscar por categoria',
            searchData: searchData,
            createPopUp: () => handlePopUpOpen('create'),
          }}
          totalPage={totalPage}
        >
          <List>
            {listPlaylistCategory.length > 0 ? (
              listPlaylistCategory.map((category) => (
                <PlaylistCategoryItem
                  key={category.id}
                  editPlaylistCategory={async () =>
                    handlePopUpOpen('edit', category.id)
                  }
                  deletePlaylistCategory={async () =>
                    handlePopUpOpen('delete', category.id)
                  }
                  category={category}
                />
              ))
            ) : (
              <EmptyListResponse
                message="Sem Categorias"
                icon={
                  <DoNotTouchIcon
                    sx={{
                      fontSize: theme.spacing(10),
                    }}
                  />
                }
              />
            )}
          </List>
        </ContainerSimpleList>
      </LayoutBase>
      {SnackbarAlert}
    </>
  );
};
