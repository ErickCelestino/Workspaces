import { CrudType, IconMenuItem } from '@workspaces/domain';
import FolderOffIcon from '@mui/icons-material/FolderOff';
import {
  DirectoryCard,
  DirectoryModals,
  EmptyListResponse,
  ToolbarPureTV,
} from '../../components';
import React, { useCallback, useEffect, useState } from 'react';
import { Grid, Icon, useTheme } from '@mui/material';
import { useSnackbarAlert, useDirectoryData } from '../../hooks';
import { LayoutBase } from '../../layout';
import { useLoggedUser } from '../../contexts';
import { setItemLocalStorage } from '../../services';
import { useNavigate } from 'react-router-dom';
import { ContainerCardList } from '../utils';

export const ListDirectoryContainer = () => {
  const { loggedUser } = useLoggedUser();
  const theme = useTheme();
  const navigate = useNavigate();
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

  const { listDirectory, totalPage, getData } = useDirectoryData({
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
      icon: <Icon>create_new_folder</Icon>,
      title: 'Novo Diretório',
      handleClick: async () => handlePopUpOpen('create'),
    },
  ];

  const handleDirectoryClick = (directoryId: string) => {
    setItemLocalStorage(directoryId, 'di');
    navigate(`/files`);
  };

  const renderDirectories = () =>
    listDirectory.length > 0 ? (
      <Grid justifyContent={'center'} container spacing={2}>
        {listDirectory.map((directory, index) => (
          <Grid item md={6} lg={4} xl={3} key={index}>
            <DirectoryCard
              onClick={() => handleDirectoryClick(directory.id)}
              idDirectory={directory.id}
              name={directory.name}
              deleteDirectory={async () =>
                handlePopUpOpen('delete', directory.id)
              }
            />
          </Grid>
        ))}
      </Grid>
    ) : (
      <EmptyListResponse
        message="Sem Diretórios"
        icon={
          <FolderOffIcon
            sx={{
              fontSize: theme.spacing(10),
            }}
          />
        }
      />
    );

  return (
    <>
      <DirectoryModals
        selectedId={selectedId}
        openModal={openModal}
        handlePopUpClose={handlePopUpClose}
        showAlert={showAlert}
      />

      <LayoutBase
        title="Listagem de Diretórios"
        iconMenuItemList={rightClickMenuList}
        toolBar={<ToolbarPureTV />}
      >
        <ContainerCardList
          handleChange={handleChange}
          search={{
            searchData: searchData,
            placeholder: 'Pesquisar diretório',
            createPopUp: () => handlePopUpOpen('create'),
          }}
          totalPage={totalPage}
        >
          {renderDirectories()}
        </ContainerCardList>
      </LayoutBase>
      {SnackbarAlert}
    </>
  );
};
