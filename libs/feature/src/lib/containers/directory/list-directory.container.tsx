import {
  CrudType,
  Directory,
  ErrorResponse,
  IconMenuItem,
  ListDirectoryDto,
} from '@workspaces/domain';
import FolderOffIcon from '@mui/icons-material/FolderOff';
import {
  CreateDirectoryModal,
  DirectoryCard,
  EmptyListResponse,
  ToolbarPureTV,
} from '../../components';
import React, { useCallback, useEffect, useState } from 'react';
import { Grid, Icon, useTheme } from '@mui/material';
import { useSnackbarAlert } from '../../hooks';
import { LayoutBase } from '../../layout';
import { useLoggedUser } from '../../contexts';
import { ListDirectoryRequest, setItemLocalStorage } from '../../services';
import axios, { AxiosError } from 'axios';
import { ValidationsError } from '../../shared';
import { useNavigate } from 'react-router-dom';
import { ContainerCardList } from '../utils';

export const ListDirectoryContainer = () => {
  const theme = useTheme();
  const { loggedUser } = useLoggedUser();
  const navigate = useNavigate();

  const { SnackbarAlert, showSnackbarAlert } = useSnackbarAlert();
  const [createDirectoryPopUp, setCreateDirectoryPopUp] = useState(false);
  const [search, setSearch] = useState(false);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [listDirectory, setListDirectory] = useState<Directory[]>([]);

  const handlePopUpClose = (types: CrudType) => {
    switch (types) {
      case 'create':
        setCreateDirectoryPopUp(false);
        break;
    }
  };

  const handlePopUpOpen = (types: CrudType) => {
    switch (types) {
      case 'create':
        setCreateDirectoryPopUp(true);
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
    async (data: ListDirectoryDto) => {
      try {
        const result = await ListDirectoryRequest({
          loggedUserId: data.loggedUserId,
          companyId: data.companyId,
          userInput: data.userInput ?? '',
          skip: data.skip,
          take: data.take,
        });
        return result;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ErrorResponse>;
          const errors = ValidationsError(axiosError, 'Diretórios');
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
      companyId: loggedUser?.selectedCompany.id ?? '',
      loggedUserId: loggedUser?.id ?? '',
      userInput: input,
    });

    setTotalPage(result?.totalPages ?? 0);
    setListDirectory(result?.directories ?? []);
  };

  const handleChange = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setSearch(true);
    const result = await ListDirectoryRequest({
      userInput: '',
      companyId: loggedUser?.selectedCompany.id ?? '',
      loggedUserId: loggedUser?.id ?? '',
      skip: (value - 1) * 6,
    });
    setTotalPage(result.totalPages);
    setListDirectory(result.directories);
  };

  const getData = useCallback(async () => {
    const result = await handleData({
      companyId: loggedUser?.selectedCompany.id ?? '',
      loggedUserId: loggedUser?.id ?? '',
      userInput: '',
    });
    setTotalPage(result?.totalPages ?? 0);
    setListDirectory(result?.directories ?? []);
  }, [handleData, loggedUser]);

  useEffect(() => {
    if (!search) {
      getData();
    }
  }, [getData, search]);

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
  return (
    <>
      <CreateDirectoryModal
        handlePopUpClose={() => handlePopUpClose('create')}
        open={createDirectoryPopUp}
        showAlert={showAlert}
        title="Novo Diretório"
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
          {listDirectory.length > 0 ? (
            <Grid justifyContent={'center'} container spacing={2}>
              {listDirectory.map((directory, index) => (
                <Grid item md={6} lg={4} xl={3} key={index}>
                  <DirectoryCard
                    onClick={() => handleDirectoryClick(directory.id)}
                    idDirectory={directory.id}
                    name={directory.name}
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
          )}
        </ContainerCardList>
      </LayoutBase>
      {SnackbarAlert}
    </>
  );
};
