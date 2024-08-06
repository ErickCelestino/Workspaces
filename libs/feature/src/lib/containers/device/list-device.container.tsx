import {
  Box,
  Grid,
  Icon,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  CreateDeviceModal,
  DeleteDeviceModal,
  DeviceCard,
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
  const [deleteDevicePopUp, setDeleteDevicePopUp] = useState(false);
  const [listDevice, setListDevice] = useState<Device[]>([]);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [search, setSearch] = useState(false);
  const [selectedId, setSelectedId] = useState<string>('');

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
      case 'edit':
        break;
      case 'delete':
        setSelectedId(id ?? '');
        setDeleteDevicePopUp(true);
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
      skip: (value - 1) * 8,
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
      <DeleteDeviceModal
        open={deleteDevicePopUp}
        title="Deletar Dispositivo"
        subTitle="Por favor, selecione alguma das alternativas"
        handlePopUpClose={() => setDeleteDevicePopUp(false)}
        showAlert={showAlert}
        idToDelete={selectedId}
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
              <Box display="flex" justifyContent="center" width="100%">
                <Grid
                  display="flex"
                  justifyContent="center"
                  container
                  spacing={2}
                >
                  {listDevice.map((device, index) => (
                    <Grid item key={index}>
                      <DeviceCard
                        name={device.name}
                        editDevice={async () =>
                          handlePopUpOpen('edit', device.id)
                        }
                        deleteDevice={async () =>
                          handlePopUpOpen('delete', device.id)
                        }
                        key={device.id}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
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
