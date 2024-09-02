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
import { CreateCompanyModal } from '../../components/modal/company';
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
  const [search, setSearch] = useState(false);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [createCompanyPopUp, setCreateCompanyPopUp] = useState(false);

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

  useEffect(() => {
    if (!search) {
      handleData({
        filter: '',
        loggedUserId: loggedUser?.id ?? '',
      });
    }
  }, [handleData, loggedUser, search]);

  const searchData = async (input: string) => {
    setSearch(true);
    const result = await handleData({
      filter: input,
      loggedUserId: loggedUser?.id ?? '',
    });
    if (result) {
      setListCompany(result.companies);
      setTotalPage(result.totalPages);
    }
  };

  const handleChange = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setSearch(true);
    const result = await handleData({
      loggedUserId: loggedUser?.id ?? '',
      filter: '',
      skip: (value - 1) * 6,
    });
    if (result) {
      setListCompany(result.companies);
      setTotalPage(result.totalPages);
    }
  };

  const handlePopUpOpen = (types: CrudType, id?: string) => {
    switch (types) {
      case 'create':
        setCreateCompanyPopUp(true);
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
        handlePopUpClose={() => setCreateCompanyPopUp(false)}
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
          <List>
            {listCompany.length > 0 ? (
              listCompany.map((company) => (
                <CompanyItem
                  statusColor={
                    company.status === 'ACTIVE' ? 'success' : 'error'
                  }
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
