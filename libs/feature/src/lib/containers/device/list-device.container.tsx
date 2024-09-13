import { Box, Grid, Icon, useTheme } from '@mui/material';
import DesktopAccessDisabledIcon from '@mui/icons-material/DesktopAccessDisabled';
import {
  DeviceCard,
  DeviceModals,
  EmptyListResponse,
  ToolbarPureTV,
} from '../../components';
import { LayoutBase } from '../../layout';
import { CrudType, IconMenuItem } from '@workspaces/domain';
import { useCallback, useEffect, useState } from 'react';
import { useDeviceData, useSnackbarAlert } from '../../hooks';
import { ContainerCardList } from '../utils';
import { useLoggedUser } from '../../contexts';

export const ListDeviceContainer = () => {
  const { loggedUser } = useLoggedUser();
  const theme = useTheme();
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

  const { listDevice, totalPage, getData } = useDeviceData({
    showAlert,
    loggedUserId: loggedUser?.id ?? '',
    companyId: loggedUser?.selectedCompany.id ?? '',
  });

  const handlePopUpOpen = async (type: CrudType | 'add', id?: string) => {
    setSelectedId(id ?? '');
    setOpenModal((prev) => ({
      ...prev,
      [type]: true,
    }));
  };

  const handlePopUpClose = async (type: CrudType | 'add') => {
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

  const rightClickMenuList: IconMenuItem[] = [
    {
      icon: <Icon>playlist_add</Icon>,
      title: 'Novo Dispositivo',
      handleClick: async () => handlePopUpOpen('create'),
    },
  ];

  const renderDevices = () =>
    listDevice.length > 0 ? (
      listDevice.map((device) => (
        <Box display="flex" justifyContent="center" width="100%">
          <Grid display="flex" justifyContent="center" container spacing={2}>
            <Grid item key={device.id}>
              <DeviceCard
                key={device.id}
                name={device.name}
                addSchedulesToDevice={() => handlePopUpOpen('add', device.id)}
                deleteDevice={() => handlePopUpOpen('delete', device.id)}
                detailsDevice={() => handlePopUpOpen('details', device.id)}
                editDevice={() => handlePopUpOpen('edit', device.id)}
              />
            </Grid>
          </Grid>
        </Box>
      ))
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
    );

  const searchData = async (input: string) => {
    getData(input);
  };

  const handleChange = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    getData('', value);
  };

  return (
    <>
      <DeviceModals
        selectedId={selectedId}
        openModal={openModal}
        handlePopUpClose={handlePopUpClose}
        showAlert={showAlert}
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
          {renderDevices()}
        </ContainerCardList>
      </LayoutBase>
      {SnackbarAlert}
    </>
  );
};
