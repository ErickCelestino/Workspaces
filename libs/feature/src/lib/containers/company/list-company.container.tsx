import { List, useTheme } from '@mui/material';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import StoreIcon from '@mui/icons-material/Store';
import { useLoggedUser } from '../../contexts';
import { FC, useCallback, useEffect, useState } from 'react';
import {
  CrudType,
  ErrorResponse,
  IconMenuItem,
  ListCompanyDto,
  ListSimpleCompanyResponseDto,
} from '@workspaces/domain';
import { useSnackbarAlert } from '../../hooks';
import axios, { AxiosError } from 'axios';
import { ValidationsError } from '../../shared';
import { ContainerSimpleList } from '../utils';
import { LayoutBase } from '../../layout';
import {
  CompanyItem,
  EmptyListResponse,
  ToolbarPureTV,
} from '../../components';
import {
  CreateCompanyModal,
  DeleteCompanyModal,
  EditCompanyModal,
} from '../../components/modal/company';
import { ListCompanyRequest } from '../../services';

interface ListCompanyContainerProps {
  createCompanyButtonTitle?: string;
}

export const ListCompanyContainer: FC<ListCompanyContainerProps> = ({
  createCompanyButtonTitle = 'Nova Empresa',
}) => {
  const { loggedUser } = useLoggedUser();
  const theme = useTheme();
  const { showSnackbarAlert, SnackbarAlert } = useSnackbarAlert();

  const [listCompany, setListCompany] = useState<
    ListSimpleCompanyResponseDto[]
  >([]);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [createCompanyPopUp, setCreateCompanyPopUp] = useState(false);
  const [selectedId, setSelectedId] = useState<string>('');
  const [deleteCompanyPopUp, setDeleteCompanyPopUp] = useState(false);
  const [editCompanyPopUp, setEditCompanyPopUp] = useState(false);
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
  const handleData = useCallback(
    async (data: ListCompanyDto) => {
      try {
        const result = await ListCompanyRequest({
          loggedUserId: data.loggedUserId,
          filter: data.filter,
          skip: data.skip,
          take: data.take,
        });
        if (result) {
          setListCompany(result.companies);
          setTotalPage(result.totalPages);
        }
        return result;
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ErrorResponse>;
          const errors = ValidationsError(axiosError, 'Empresa');
          if (errors) {
            showAlert(errors, false);
          }
        }
      }
    },
    [showAlert]
  );

  const getData = useCallback(
    async (input?: string, skip?: number) => {
      const result = await handleData({
        filter: input ? input : '',
        skip: skip ? (skip - 1) * 6 : 0,
        loggedUserId: loggedUser?.id ?? '',
      });
      if (result) {
        setListCompany(result.companies);
        setTotalPage(result.totalPages);
      }
    },
    [loggedUser, handleData]
  );

  useEffect(() => {
    setIsMounted(false);
  }, [loggedUser?.selectedCompany.id]);

  useEffect(() => {
    if (!isMounted) {
      getData();
      setIsMounted(true);
    }
  }, [isMounted, handleData]);

  const searchData = async (input: string) => {
    getData(input);
  };

  const handleChange = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    getData('', value);
  };

  const handlePopUpOpen = (types: CrudType, id?: string) => {
    switch (types) {
      case 'create':
        setCreateCompanyPopUp(true);
        break;
      case 'delete':
        setSelectedId(id ?? '');
        setDeleteCompanyPopUp(true);
        break;
      case 'edit':
        setSelectedId(id ?? '');
        setEditCompanyPopUp(true);
        break;
    }
  };

  const handleClose = (data: CrudType) => {
    getData();
    switch (data) {
      case 'create':
        setCreateCompanyPopUp(false);
        break;
      case 'delete':
        setDeleteCompanyPopUp(false);
        break;
      case 'edit':
        setEditCompanyPopUp(false);
        break;
    }
  };

  const rightClickMenuList: IconMenuItem[] = [
    {
      icon: <AddBusinessIcon />,
      title: createCompanyButtonTitle,
      handleClick: async () => handlePopUpOpen('create'),
    },
  ];

  return (
    <>
      <CreateCompanyModal
        open={createCompanyPopUp}
        title="Cadastrar Empresa"
        handlePopUpClose={() => handleClose('create')}
        showAlert={showAlert}
      />
      <DeleteCompanyModal
        open={deleteCompanyPopUp}
        title="Deletar Empresa"
        handlePopUpClose={() => handleClose('delete')}
        showAlert={showAlert}
        idToDelete={selectedId}
      />
      <EditCompanyModal
        open={editCompanyPopUp}
        title="Editar Empresa"
        handlePopUpClose={() => handleClose('edit')}
        showAlert={showAlert}
        companyId={selectedId}
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
          <List>
            {listCompany.length > 0 ? (
              listCompany.map((company) => (
                <CompanyItem
                  statusColor={
                    company.status === 'ACTIVE' ? 'success' : 'error'
                  }
                  deleteCompany={async () =>
                    handlePopUpOpen('delete', company.id)
                  }
                  editCompany={async () => handlePopUpOpen('edit', company.id)}
                  company={company}
                  key={company.id}
                />
              ))
            ) : (
              <EmptyListResponse
                message="Sem Empresas"
                icon={
                  <StoreIcon
                    sx={{
                      fontSize: theme.spacing(10),
                    }}
                  />
                }
              />
            )}
          </List>
        </ContainerSimpleList>
      </LayoutBase>
      {SnackbarAlert}
    </>
  );
};
