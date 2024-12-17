import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import { CrudType, IconMenuItem } from '@workspaces/domain';
import { useRef, useCallback, useState, useEffect } from 'react';
import {
  EmptyListResponse,
  ProductItem,
  ProductModals,
} from '../../../components';
import { LayoutBase } from '../../../layout';
import { useLoggedUser } from '../../../contexts';
import { List, useTheme } from '@mui/material';
import { useListProductData, useSnackbarAlert } from '../../../hooks';
import { ContainerSimpleList } from '../../utils';

export const ListProductContainer = () => {
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

  const { listProduct, totalPage, getListProductData } = useListProductData({
    showAlert,
    loggedUserId: loggedUser?.id ?? '',
  });

  useEffect(() => {
    if (!hasLoadedUserData.current) {
      getListProductData();
      hasLoadedUserData.current = true;
    }
  }, [getListProductData]);

  const searchData = async (input: string) => {
    getListProductData(input);
  };

  const handleChange = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    getListProductData('', value);
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
    getListProductData();
  };

  const renderProducts = () =>
    listProduct.length > 0 ? (
      listProduct.map((product) => (
        <ProductItem
          key={product.id}
          product={product}
          deleteProduct={() => handlePopUpOpen('delete', product.id)}
        />
      ))
    ) : (
      <EmptyListResponse
        message="Sem Produtos"
        icon={
          <ProductionQuantityLimitsIcon
            sx={{
              fontSize: theme.spacing(10),
            }}
          />
        }
      />
    );

  const rightClickMenuList: IconMenuItem[] = [
    {
      icon: <AddShoppingCartIcon />,
      title: 'Novo Produto',
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
          totalPage={totalPage}
          handleChange={handleChange}
        >
          <List> {renderProducts()} </List>
        </ContainerSimpleList>
      </LayoutBase>
      {SnackbarAlert}
    </>
  );
};
