import { Icon, useMediaQuery, useTheme } from '@mui/material';
import {
  CreateDeviceModal,
  MobileButtonMenu,
  RightClickMenu,
  ToolbarPureTV,
} from '../../components';
import { LayoutBase } from '../../layout';
import { CrudType, IconMenuItem } from '@workspaces/domain';
import { useCallback, useState } from 'react';
import { useSnackbarAlert } from '../../hooks';
import { ContainerCardList } from '../utils';

export const ListDeviceContainer = () => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const { showSnackbarAlert, SnackbarAlert } = useSnackbarAlert();

  const [createDevicePopUp, setCreateDevicePopUp] = useState(false);
  const [totalPage, setTotalPage] = useState<number>(1);

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
    // More Implementation
  };

  const searchData = async (input: string) => {};

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
            {' '}
          </ContainerCardList>
        </RightClickMenu>
      </LayoutBase>
      {SnackbarAlert}
    </>
  );
};
