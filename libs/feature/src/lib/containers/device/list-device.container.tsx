import { Box, Grid, Icon, useTheme } from '@mui/material';
import DesktopAccessDisabledIcon from '@mui/icons-material/DesktopAccessDisabled';
import {
  AddSchedulesToDeviceModal,
  CreateDeviceModal,
  DeleteDeviceModal,
  DetailsDeviceModal,
  DeviceCard,
  EditDeviceModal,
  EmptyListResponse,
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
  const { showSnackbarAlert, SnackbarAlert } = useSnackbarAlert();

  const [createDevicePopUp, setCreateDevicePopUp] = useState(false);
  const [deleteDevicePopUp, setDeleteDevicePopUp] = useState(false);
  const [editDevicePopUp, setEditDevicePopUp] = useState(false);
  const [detailsDevicePopUp, setDetailsDevicePopUp] = useState(false);
  const [addSchedulesToDevicePopUp, setAddSchedulesToDevicePopUp] =
    useState(false);
  const [listDevice, setListDevice] = useState<Device[]>([]);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [selectedId, setSelectedId] = useState<string>('');
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

  const handlePopUpOpen = (types: CrudType | 'add', id?: string) => {
    switch (types) {
      case 'create':
        setCreateDevicePopUp(true);
        break;
      case 'edit':
        setSelectedId(id ?? '');
        setEditDevicePopUp(true);
        break;
      case 'delete':
        setSelectedId(id ?? '');
        setDeleteDevicePopUp(true);
        break;
      case 'add':
        setSelectedId(id ?? '');
        setAddSchedulesToDevicePopUp(true);
        break;
      case 'details':
        setSelectedId(id ?? '');
        setDetailsDevicePopUp(true);
        break;
    }
  };

  const handleClose = (data: CrudType) => {
    getData();
    switch (data) {
      case 'create':
        setCreateDevicePopUp(false);
        break;
      case 'delete':
        setDeleteDevicePopUp(false);
        break;
      case 'edit':
        setEditDevicePopUp(false);
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
    getData('', value);
  };

  const handleData = useCallback(
    async (data: ListDeviceDto) => {
      try {
        const result = await ListDeviceRequest({
          companyId: loggedUser?.selectedCompany.id ?? '',
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
    [loggedUser?.selectedCompany.id, showAlert]
  );

  const getData = useCallback(
    async (input?: string, skip?: number) => {
      const result = await handleData({
        companyId: loggedUser?.selectedCompany.id ?? '',
        loggedUserId: loggedUser?.id ?? '',
        filter: input ? input : '',
        skip: skip ? (skip - 1) * 8 : 0,
      });
      if (result) {
        setTotalPage(result?.totalPages ?? 0);
        setListDevice(result?.devices ?? []);
      }
    },
    [loggedUser, handleData]
  );

  const searchData = async (input: string) => {
    getData(input);
  };

  useEffect(() => {
    setIsMounted(false);
  }, [loggedUser?.selectedCompany.id]);

  useEffect(() => {
    if (!isMounted) {
      getData();
      setIsMounted(true);
    }
  }, [isMounted, getData]);

  return (
    <>
      <CreateDeviceModal
        open={createDevicePopUp}
        title="Novo Dispositivo"
        handlePopUpClose={() => handleClose('create')}
        showAlert={showAlert}
      />
      <DeleteDeviceModal
        open={deleteDevicePopUp}
        title="Deletar Dispositivo"
        subTitle="Por favor, selecione alguma das alternativas"
        handlePopUpClose={() => handleClose('delete')}
        showAlert={showAlert}
        idToDelete={selectedId}
      />
      <EditDeviceModal
        open={editDevicePopUp}
        title="Editar Dispositivo"
        handlePopUpClose={() => handleClose('edit')}
        showAlert={showAlert}
        idToEdit={selectedId}
      />
      <AddSchedulesToDeviceModal
        open={addSchedulesToDevicePopUp}
        title="Adicionar Agendamento"
        handlePopUpClose={() => setAddSchedulesToDevicePopUp(false)}
        showAlert={showAlert}
        idDevice={selectedId}
      />
      <DetailsDeviceModal
        open={detailsDevicePopUp}
        title="Detalhes Dispositivo"
        handlePopUpClose={() => setDetailsDevicePopUp(false)}
        showAlert={showAlert}
        idDevice={selectedId}
      />
      <LayoutBase
        title="Listagem Dispositivos"
        iconMenuItemList={rightClickMenuList}
        toolBar={<ToolbarPureTV />}
      >
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
                      addSchedulesToDevice={async () =>
                        handlePopUpOpen('add', device.id)
                      }
                      detailsDevice={async () =>
                        handlePopUpOpen('details', device.id)
                      }
                      key={device.id}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <EmptyListResponse
              message="Sem Dispositivos"
              icon={
                <DesktopAccessDisabledIcon
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
