import {
  Icon,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import {
  CrudType,
  Directory,
  ErrorResponse,
  IconMenuItem,
  ListDirectoryDto,
} from '@workspaces/domain';
import { ListDirectoryRequest, setItemLocalStorage } from '../../../services';
import axios, { AxiosError } from 'axios';
import { ValidationsError } from '../../../shared';
import { useSnackbarAlert } from '../../../hooks';
import { useLoggedUser } from '../../../contexts';
import { CreateDirectoryModal } from '../../modal';
import { RightClickMenu } from '../../menu';

export const ListDirectory = () => {
  const [selectedDirectory, setSelectedDirectory] = useState<string | null>(
    null
  );
  const { SnackbarAlert, showSnackbarAlert } = useSnackbarAlert();
  const [listDirectory, setListDirectory] = useState<Directory[]>([]);
  const [createDirectoryPopUp, setCreateDirectoryPopUp] = useState(false);

  const { loggedUser } = useLoggedUser();

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

  const getData = useCallback(async () => {
    const result = await handleData({
      loggedUserId: loggedUser?.id ?? '',
      userInput: '',
    });
    setListDirectory(result?.directories ?? []);
  }, [handleData, loggedUser]);

  useEffect(() => {
    getData();
  }, [getData]);

  const handlePopUpOpen = (types: CrudType) => {
    switch (types) {
      case 'create':
        setCreateDirectoryPopUp(true);
        break;
    }
  };

  const handlePopUpClose = (types: CrudType) => {
    switch (types) {
      case 'create':
        setCreateDirectoryPopUp(false);
        break;
    }
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
    setSelectedDirectory(directoryId);
  };

  return (
    <>
      <CreateDirectoryModal
        handlePopUpClose={() => handlePopUpClose('create')}
        open={createDirectoryPopUp}
        showAlert={showAlert}
        title="Novo Diretório"
      />
      <RightClickMenu iconMenuItemList={rightClickMenuList}>
        <List component={'nav'}>
          {listDirectory.map((directory, index) => (
            <ListItemButton
              key={index}
              selected={selectedDirectory === directory.id}
              onClick={() => handleDirectoryClick(directory.id)}
            >
              <ListItemIcon>
                <Icon>folder</Icon>
              </ListItemIcon>
              <ListItemText primary={directory.name} />
            </ListItemButton>
          ))}
        </List>
      </RightClickMenu>
      {SnackbarAlert}
    </>
  );
};
