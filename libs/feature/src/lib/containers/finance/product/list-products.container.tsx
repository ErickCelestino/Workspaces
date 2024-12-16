import { CrudType, IconMenuItem } from '@workspaces/domain';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useRef, useCallback, useState } from 'react';
import { ProductModals, ToolbarPureTV } from '../../../components';
import { LayoutBase } from '../../../layout';
import { useLoggedUser } from '../../../contexts';
import { List, useTheme } from '@mui/material';
import { useSnackbarAlert } from '../../../hooks';
import { ContainerSimpleList } from '../../utils';

export const ListProductContainer = () => {
  //const { loggedUser } = useLoggedUser();
  //const theme = useTheme();
  const { showSnackbarAlert, SnackbarAlert } = useSnackbarAlert();
  const [selectedId, setSelectedId] = useState<string>('');
  const [openModal, setOpenModal] = useState({
    create: false,
    delete: false,
    edit: false,
    details: false,
    add: false,
  });
  const hasLoadedUserData = useRef(false);

  const showAlert = useCallback(
    (message: string, success: boolean) => {
      showSnackbarAlert({
        message: message,
        severity: success ? 'success' : 'error',
      });
    },
    [showSnackbarAlert]
  );
  const searchData = async (input: string) => {
    //getListSchedulesData(input);
  };
  const handleChange = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    //getListSchedulesData('', value);
  };
  const handlePopUpOpen = async (type: CrudType, id?: string) => {
    setSelectedId(id ?? '');
    setOpenModal((prev) => ({
      ...prev,
      [type]: true,
    }));
  };

  const handlePopUpClose = async (type: CrudType) => {
    setOpenModal((prev) => ({
      ...prev,
      [type]: false,
    }));
    // getListSchedulesData();
  };

  const rightClickMenuList: IconMenuItem[] = [
    {
      icon: <AddShoppingCartIcon />,
      title: 'Novo Agendamento',
      handleClick: async () => handlePopUpOpen('create'),
    },
  ];
  return (
    <>
      <ProductModals
        selectedId={selectedId}
        openModal={openModal}
        handlePopUpClose={handlePopUpClose}
        showAlert={showAlert}
      />
      <LayoutBase
        title="Listagem Produtos"
        iconMenuItemList={rightClickMenuList}
        toolBar={null}
      >
        <ContainerSimpleList
          search={{
            placeholder: 'Pesquisar por produto',
            searchData: searchData,
            createPopUp: () => handlePopUpOpen('create'),
          }}
          totalPage={0}
          handleChange={handleChange}
        >
          <List></List>
        </ContainerSimpleList>
      </LayoutBase>
      {SnackbarAlert}
    </>
  );
};
