import {
  Box,
  Divider,
  Icon,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Pagination,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { FC, useCallback, useEffect, useState } from 'react';
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
import { SearchBar } from '../../search';
import React from 'react';

interface ListDirectoryProps {
  getDataInput: () => void;
}

export const ListDirectory: FC<ListDirectoryProps> = ({ getDataInput }) => {
  const [selectedDirectory, setSelectedDirectory] = useState<string | null>(
    null
  );
  const { SnackbarAlert, showSnackbarAlert } = useSnackbarAlert();
  const [listDirectory, setListDirectory] = useState<Directory[]>([]);
  const [createDirectoryPopUp, setCreateDirectoryPopUp] = useState(false);
  const [searchTest, setSearchTest] = useState(false);
  const [totalPageTest, setTotalPageTest] = useState<number>(1);

  const { loggedUser } = useLoggedUser();

  const theme = useTheme();
  const mdDown = useMediaQuery(theme.breakpoints.down('md'));

  const searchData = async (input: string) => {
    setSearchTest(true);
    const result = await handleData({
      userInput: input,
      loggedUserId: loggedUser?.id ?? '',
    });

    setTotalPageTest(result?.totalPages ?? 0);
    setListDirectory(result?.directories ?? []);
  };

  const handleChange = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setSearchTest(true);
    const result = await ListDirectoryRequest({
      userInput: '',
      loggedUserId: loggedUser?.id ?? '',
      skip: (value - 1) * 6,
    });

    if (result) {
      setTotalPageTest(result.totalPages);
      setListDirectory(result.directories);
    } else {
      console.error('handleChange result is undefined or null');
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

  const getData = useCallback(async () => {
    const result = await handleData({
      loggedUserId: loggedUser?.id ?? '',
      userInput: '',
    });
    setListDirectory(result?.directories ?? []);
  }, [handleData, loggedUser]);

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
    getDataInput();
  };

  useEffect(() => {
    if (!searchTest) {
      getData();
    }
  }, [getData, searchTest]);

  return (
    <>
      <CreateDirectoryModal
        handlePopUpClose={() => handlePopUpClose('create')}
        open={createDirectoryPopUp}
        showAlert={showAlert}
        title="Novo Diretório"
      />
      <Box
        display="flex"
        flexDirection={'column'}
        sx={{
          maxHeight: theme.spacing(65),
          marginLeft: theme.spacing(2),
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.shadows[3],
          padding: theme.spacing(2),
          borderRadius: theme.shape.borderRadius,
          marginBottom: theme.spacing(2),
          backgroundColor:
            theme.palette.mode === 'dark'
              ? theme.palette.grey[800]
              : theme.palette.primary.main,
        }}
      >
        <Box display={'flex'} flexDirection={'column'} height={'100%'}>
          <Typography variant="h6" gutterBottom marginLeft={theme.spacing(2)}>
            Diretórios
          </Typography>
          <SearchBar onSearch={searchData} placeholder="Pesquisar diretório" />
          <RightClickMenu iconMenuItemList={rightClickMenuList}>
            <List component={'nav'}>
              {listDirectory.map((directory, index) => (
                <React.Fragment key={`fragment-${directory.id}`}>
                  <Divider key={`divider-${directory.id}`} />
                  <ListItemButton
                    key={directory.id}
                    selected={selectedDirectory === directory.id}
                    onClick={() => handleDirectoryClick(directory.id)}
                  >
                    <ListItemIcon>
                      <Icon>folder</Icon>
                    </ListItemIcon>
                    <Tooltip title={directory.name}>
                      <ListItemText
                        primary={directory.name}
                        primaryTypographyProps={{
                          noWrap: true,
                          style: {
                            maxWidth: mdDown
                              ? theme.spacing(10)
                              : theme.spacing(20),
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          },
                        }}
                      />
                    </Tooltip>
                  </ListItemButton>
                </React.Fragment>
              ))}
            </List>
          </RightClickMenu>
        </Box>
        <Box
          display={'flex'}
          justifyContent={'center'}
          flexDirection={'row'}
          marginBottom={theme.spacing(1)}
        >
          <Pagination
            count={totalPageTest}
            color="primary"
            onChange={handleChange}
          />
        </Box>
      </Box>
      {SnackbarAlert}
    </>
  );
};
