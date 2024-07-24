import {
  CrudType,
  Directory,
  ErrorResponse,
  IconMenuItem,
  ListDirectoryDto,
} from '@workspaces/domain';
import {
  ContainerCardList,
  CreateDirectoryModal,
  DirectoryCard,
  MobileButtonMenu,
  RightClickMenu,
  ToolbarPureTV,
} from '../../components';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Icon,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useSnackbarAlert } from '../../hooks';
import { LayoutBase } from '../../layout';
import { useLoggedUser } from '../../contexts';
import { ListDirectoryRequest, setItemLocalStorage } from '../../services';
import axios, { AxiosError } from 'axios';
import { ValidationsError } from '../../shared';
import { useNavigate } from 'react-router-dom';

export const ListDirectoryContainer = () => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
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
      loggedUserId: loggedUser?.id ?? '',
      skip: (value - 1) * 6,
    });
    setTotalPage(result.totalPages);
    setListDirectory(result.directories);
  };

  const getData = useCallback(async () => {
    const result = await handleData({
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
      <LayoutBase title="Listagem de Diretórios" toolBar={<ToolbarPureTV />}>
        <RightClickMenu iconMenuItemList={rightClickMenuList}>
          {smDown && <MobileButtonMenu iconMenuItemList={rightClickMenuList} />}

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
        </RightClickMenu>
      </LayoutBase>
      {SnackbarAlert}
    </>
  );
};
