import { List, useTheme } from '@mui/material';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import {
  UserListItem,
  ToolbarPureTV,
  EmptyListResponse,
  DeleteUserModal,
  EditUserModal,
} from '../../components';
import { LayoutBase } from '../../layout';
import { useCallback, useEffect, useState } from 'react';
import { ListUserRequest } from '../../services';
import {
  CrudType,
  ErrorResponse,
  ListUserDto,
  UserList,
} from '@workspaces/domain';
import { useSnackbarAlert } from '../../hooks';
import axios, { AxiosError } from 'axios';
import { ValidationsError } from '../../shared';
import { useLoggedUser } from '../../contexts';
import { ContainerSimpleList } from '../utils';

export const ListUserContainer = () => {
  const [deleteUserPopUp, setDeleteUserPopUp] = useState<boolean>(false);
  const [editUserPopUp, setEditUserPopUp] = useState<boolean>(false);
  const [userList, setUserList] = useState<UserList[]>([]);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [selectedId, setSelectedId] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);
  const theme = useTheme();
  const { loggedUser } = useLoggedUser();
  const { showSnackbarAlert, SnackbarAlert } = useSnackbarAlert();

  const showAlert = useCallback(
    (message: string, success: boolean) => {
      showSnackbarAlert({
        message: message,
        severity: success ? 'success' : 'error',
      });
    },
    [showSnackbarAlert]
  );

  const handleChange = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    getData('', value);
  };

  const handleData = useCallback(
    async (data: ListUserDto) => {
      try {
        const result = await ListUserRequest({
          filter: data.filter,
          loggedUserId: data.loggedUserId,
        });
        return result;
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ErrorResponse>;
          const errors = ValidationsError(axiosError, 'Usuarios');
          if (errors) {
            showAlert(errors, false);
          }
        }
      }
    },
    [showAlert]
  );

  const handlePopUpOpen = (types: CrudType, id?: string) => {
    switch (types) {
      case 'edit':
        setSelectedId(id ?? '');
        setEditUserPopUp(true);
        break;
      case 'delete':
        setSelectedId(id ?? '');
        setDeleteUserPopUp(true);
        break;
    }
  };

  const handleClose = (data: CrudType) => {
    getData();
    switch (data) {
      case 'delete':
        setDeleteUserPopUp(false);
        break;
      case 'edit':
        setEditUserPopUp(false);
        break;
    }
  };

  const searchData = async (input: string) => {
    getData(input);
  };

  const getData = useCallback(
    async (input?: string, skip?: number) => {
      const result = await handleData({
        loggedUserId: loggedUser?.id ?? '',
        filter: input ? input : '',
        skip: skip ? (skip - 1) * 4 : 0,
      });
      if (result) {
        setTotalPage(result?.totalPages ?? 0);
        setUserList(result?.users ?? []);
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
  }, [isMounted, getData]);

  return (
    <>
      <DeleteUserModal
        open={deleteUserPopUp}
        handlePopUpClose={() => handleClose('delete')}
        showAlert={showAlert}
        title="Deletar Usuário"
        idToDelete={selectedId}
      />
      <EditUserModal
        open={editUserPopUp}
        handlePopUpClose={() => handleClose('edit')}
        showAlert={showAlert}
        title="Editar Usuário"
        idToEdit={selectedId}
      />
      <LayoutBase title="Listagem de Usuários" toolBar={<ToolbarPureTV />}>
        <ContainerSimpleList
          search={{
            placeholder: 'Pesquisar por agendamento',
            searchData: searchData,
          }}
          totalPage={totalPage}
          handleChange={handleChange}
        >
          <List
            sx={{
              width: '100%',
            }}
          >
            {userList.length > 0 ? (
              userList.map((user) => (
                <UserListItem
                  deleteUser={async () =>
                    handlePopUpOpen('delete', user.userId)
                  }
                  editUser={async () => handlePopUpOpen('edit', user.userId)}
                  key={user.userId}
                  user={user}
                  statusColor={user.status === 'ACTIVE' ? 'success' : 'error'}
                />
              ))
            ) : (
              <EmptyListResponse
                message="Sem Usuários"
                icon={
                  <PersonOffIcon
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
