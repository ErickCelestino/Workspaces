import { List, useTheme } from '@mui/material';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import StoreIcon from '@mui/icons-material/Store';
import { useLoggedUser } from '../../contexts';
import { FC, useCallback, useEffect, useState } from 'react';
import { CrudType, IconMenuItem } from '@workspaces/domain';
import { useSnackbarAlert, useListCompanyData } from '../../hooks';
import { ContainerSimpleList } from '../utils';
import { LayoutBase } from '../../layout';
import {
  CompanyItem,
  EmptyListResponse,
  ToolbarPureTV,
  CompanyModals,
} from '../../components';

interface ListCompanyContainerProps {
  createCompanyButtonTitle?: string;
}

export const ListCompanyContainer: FC<ListCompanyContainerProps> = ({
  createCompanyButtonTitle = 'Nova Empresa',
}) => {
  const { loggedUser } = useLoggedUser();
  const theme = useTheme();
  const { showSnackbarAlert, SnackbarAlert } = useSnackbarAlert();
  const [selectedId, setSelectedId] = useState<string>('');
  const [openModal, setOpenModal] = useState({
    create: false,
    delete: false,
    edit: false,
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

  const { listCompany, totalPage, getListCompanyData } = useListCompanyData({
    showAlert,
    loggedUserId: loggedUser?.id ?? '',
  });

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
    getListCompanyData();
  };

  useEffect(() => {
    setIsMounted(false);
  }, [loggedUser?.selectedCompany.id]);

  useEffect(() => {
    if (!isMounted) {
      console.log('aa');
      getListCompanyData();
      setIsMounted(true);
    }
  }, [isMounted, getListCompanyData]);

  const searchData = async (input: string) => {
    getListCompanyData(input);
  };

  const handleChange = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    getListCompanyData('', value);
  };

  const renderCompanies = () =>
    listCompany.length > 0 ? (
      listCompany.map((company) => (
        <CompanyItem
          key={company.id}
          statusColor={company.status === 'ACTIVE' ? 'success' : 'error'}
          deleteCompany={() => handlePopUpOpen('delete', company.id)}
          editCompany={() => handlePopUpOpen('edit', company.id)}
          company={company}
        />
      ))
    ) : (
      <EmptyListResponse
        message="Sem Empresas"
        icon={<StoreIcon sx={{ fontSize: theme.spacing(10) }} />}
      />
    );

  const rightClickMenuList: IconMenuItem[] = [
    {
      icon: <AddBusinessIcon />,
      title: createCompanyButtonTitle,
      handleClick: () => handlePopUpOpen('create'),
    },
  ];

  return (
    <>
      <CompanyModals
        selectedId={selectedId}
        openModal={openModal}
        handlePopUpClose={handlePopUpClose}
        showAlert={showAlert}
      />
      <LayoutBase
        title="Listagem de Empresas"
        iconMenuItemList={rightClickMenuList}
        toolBar={<ToolbarPureTV />}
      >
        <ContainerSimpleList
          search={{
            placeholder: 'Pesquisar Empresa',
            searchData: searchData,
            createPopUp: () => handlePopUpOpen('create'),
          }}
          totalPage={totalPage}
          handleChange={handleChange}
        >
          <List>{renderCompanies()}</List>
        </ContainerSimpleList>
      </LayoutBase>
      {SnackbarAlert}
    </>
  );
};
