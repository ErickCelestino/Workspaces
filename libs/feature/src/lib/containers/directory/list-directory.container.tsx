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
  DeleteDirectoryModal,
  DirectoryCard,
  EditDirectoryModal,
  EmptyListResponse,
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
import { ContainerCardList } from '../utils';

export const ListDirectoryContainer = () => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const { loggedUser } = useLoggedUser();
  const navigate = useNavigate();

  const { SnackbarAlert, showSnackbarAlert } = useSnackbarAlert();
  const [createDirectoryPopUp, setCreateDirectoryPopUp] = useState(false);
  const [search, setSearch] = useState(true);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [listDirectory, setListDirectory] = useState<Directory[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [selectedName, setSelectedName] = useState<string>('');
  const [deleteDirectoryPopUp, setDeleteDirectoryPopUp] = useState(false);
  const [editDirectoryPopUp, setEditDirectoryPopUp] = useState(false);

  const handlePopUpClose = (types: CrudType) => {
    switch (types) {
      case 'create':
        setSearch(true);
        setCreateDirectoryPopUp(false);
        break;
      case 'delete':
        setSearch(true);
        setDeleteDirectoryPopUp(false);
        break;
      case 'edit':
        setSearch(true);
        setEditDirectoryPopUp(false);
        break;
    }
  };

  const handlePopUpOpen = (types: CrudType, id?: string, name?: string) => {
    switch (types) {
      case 'create':
        setCreateDirectoryPopUp(true);
        break;
      case 'delete':
        setSelectedId(id ?? '');
        setDeleteDirectoryPopUp(true);
        break;
      case 'edit':
        setSelectedId(id ?? '');
        setSelectedName(name ?? '');
        console.log('name', name);
        setEditDirectoryPopUp(true);
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
    setSearch(false);
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
    setSearch(false);
  };

  const getData = useCallback(async () => {
    const result = await handleData({
      loggedUserId: loggedUser?.id ?? '',
      userInput: '',
    });
    setTotalPage(result?.totalPages ?? 0);
    setListDirectory(result?.directories ?? []);
    setSearch(false);
  }, [handleData, loggedUser]);

  useEffect(() => {
    if (search) {
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
        handlePopUpClose={() => {
          handlePopUpClose('create');
        }}
        open={createDirectoryPopUp}
        showAlert={showAlert}
        title="Novo Diretório"
      />
      <DeleteDirectoryModal
        handlePopUpClose={() => handlePopUpClose('delete')}
        idToDelete={selectedId}
        open={deleteDirectoryPopUp}
        showAlert={showAlert}
        title="Deletar Diretório"
      />
      <EditDirectoryModal
        handlePopUpClose={() => handlePopUpClose('edit')}
        open={editDirectoryPopUp}
        showAlert={showAlert}
        title="Editar Diretório"
        idToEdit={selectedId}
        currentName={selectedName}
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
                    deleteDirectory={async () =>
                      handlePopUpOpen('delete', directory.id)
                    }
                    editDirectory={async () =>
                      handlePopUpOpen('edit', directory.id, directory.name)
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
          )}
        </ContainerCardList>
      </LayoutBase>
      {SnackbarAlert}
    </>
  );
};
