import { Box, Icon, Typography, useMediaQuery, useTheme } from '@mui/material';
import {
  CreateDeviceModal,
  MobileButtonMenu,
  RightClickMenu,
  ToolbarPureTV,
} from '../../components';
import { LayoutBase } from '../../layout';
import {
  CrudType,
  Device,
  ErrorResponse,
  IconMenuItem,
  ListDeviceDto,
} from '@workspaces/domain';
import { useCallback, useEffect, useState } from 'react';
import { useSnackbarAlert } from '../../hooks';
import { ContainerCardList } from '../utils';
import { ListDeviceRequest } from '../../services';
import axios, { AxiosError } from 'axios';
import { ValidationsError } from '../../shared';
import { useLoggedUser } from '../../contexts';

export const ListDeviceContainer = () => {
  const theme = useTheme();
  const { loggedUser } = useLoggedUser();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const { showSnackbarAlert, SnackbarAlert } = useSnackbarAlert();

  const [createDevicePopUp, setCreateDevicePopUp] = useState(false);
  const [listDevice, setListDevice] = useState<Device[]>([]);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [search, setSearch] = useState(false);

  const showAlert = useCallback(
    (message: string, success: boolean) => {
      showSnackbarAlert({
        message: message,
        severity: success ? 'success' : 'error',
      });
    },
    [showSnackbarAlert]
  );

  const handlePopUpOpen = (types: CrudType, id?: string) => {
    switch (types) {
      case 'create':
        setCreateDevicePopUp(true);
        break;
    }
  };

  const rightClickMenuList: IconMenuItem[] = [
    {
      icon: <Icon>playlist_add</Icon>,
      title: 'Novo Dispositivo',
      handleClick: async () => handlePopUpOpen('create'),
    },
  ];

  const handleChange = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setSearch(true);
    const result = await ListDeviceRequest({
      filter: '',
      loggedUserId: loggedUser?.id ?? '',
      skip: (value - 1) * 6,
    });
    setTotalPage(result.totalPages);
    setListDevice(result.devices);
  };

  const handleData = useCallback(
    async (data: ListDeviceDto) => {
      try {
        const result = await ListDeviceRequest({
          loggedUserId: data.loggedUserId,
          filter: data.filter,
          skip: data.skip,
          take: data.take,
        });
        return result;
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ErrorResponse>;
          const errors = ValidationsError(axiosError, 'Dispositivo');
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
      filter: '',
    });
    setTotalPage(result?.totalPages ?? 0);
    setListDevice(result?.devices ?? []);
  }, [loggedUser, handleData]);

  const searchData = async (input: string) => {
    setSearch(true);
    const result = await handleData({
      loggedUserId: loggedUser?.id ?? '',
      filter: input,
    });

    setTotalPage(result?.totalPages ?? 0);
    setListDevice(result?.devices ?? []);
  };

  useEffect(() => {
    if (!search) {
      getData();
    }
  }, [getData, search]);

  return (
    <>
      <CreateDeviceModal
        open={createDevicePopUp}
        title="Novo Dispositivo"
        handlePopUpClose={() => setCreateDevicePopUp(false)}
        showAlert={showAlert}
      />
      <LayoutBase title="Listagem Dispositivos" toolBar={<ToolbarPureTV />}>
        <RightClickMenu iconMenuItemList={rightClickMenuList}>
          {smDown && <MobileButtonMenu iconMenuItemList={rightClickMenuList} />}
          <ContainerCardList
            handleChange={handleChange}
            search={{
              searchData: searchData,
              placeholder: 'Pesquisar Dispositivo',
              createPopUp: () => handlePopUpOpen('create'),
            }}
            totalPage={totalPage}
          >
            {listDevice.length > 0 ? (
              listDevice.map((device) => <div>{device.id}</div>)
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
