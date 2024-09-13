import { Icon, List, useTheme } from '@mui/material';
import DoNotTouchIcon from '@mui/icons-material/DoNotTouch';
import {
  EmptyListResponse,
  PlaylistCategoryItem,
  PlaylistCategoryModals,
  ToolbarPureTV,
} from '../../../components';
import { LayoutBase } from '../../../layout';
import { useCallback, useEffect, useState } from 'react';
import { usePlaylistCategoryData, useSnackbarAlert } from '../../../hooks';
import { CrudType, IconMenuItem } from '@workspaces/domain';
import { useLoggedUser } from '../../../contexts';
import { ContainerSimpleList } from '../../utils';

export const ListPlaylistCategoryContainer = () => {
  const { loggedUser } = useLoggedUser();
  const theme = useTheme();
  const { showSnackbarAlert, SnackbarAlert } = useSnackbarAlert();
  const [selectedId, setSelectedId] = useState<string>('');
  const [openModal, setOpenModal] = useState({
    create: false,
    delete: false,
    edit: false,
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

  const { listPlaylistCategory, totalPage, getData } = usePlaylistCategoryData({
    showAlert,
    loggedUserId: loggedUser?.id ?? '',
    companyId: loggedUser?.selectedCompany.id ?? '',
  });

  const handlePopUpOpen = async (type: CrudType, id?: string) => {
    setSelectedId(id ?? '');
    setOpenModal((prev) => ({
      ...prev,
      [type]: true,
    }));
  };

  const handlePopUpClose = async (type: CrudType) => {
    setOpenModal((prev) => ({
      ...prev,
      [type]: false,
    }));
    getData();
  };

  const renderPlaylistCategory = () =>
    listPlaylistCategory.length > 0 ? (
      listPlaylistCategory.map((category) => (
        <PlaylistCategoryItem
          key={category.id}
          editPlaylistCategory={() => handlePopUpOpen('edit', category.id)}
          deletePlaylistCategory={() => handlePopUpOpen('delete', category.id)}
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
    );

  useEffect(() => {
    setIsMounted(false);
  }, [loggedUser?.selectedCompany.id]);

  useEffect(() => {
    if (!isMounted) {
      getData();
      setIsMounted(true);
    }
  }, [isMounted]);

  const searchData = async (input: string) => {
    getData(input);
  };

  const handleChange = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    getData('', value);
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
      <PlaylistCategoryModals
        companyId={loggedUser?.selectedCompany.id ?? ''}
        selectedId={selectedId}
        openModal={openModal}
        handlePopUpClose={handlePopUpClose}
        showAlert={showAlert}
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
          <List> {renderPlaylistCategory()} </List>
        </ContainerSimpleList>
      </LayoutBase>
      {SnackbarAlert}
    </>
  );
};
