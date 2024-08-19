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
  const [search, setSearch] = useState(false);
  const [deleteUserPopUp, setDeleteUserPopUp] = useState<boolean>(false);
  const [editUserPopUp, setEditUserPopUp] = useState<boolean>(false);
  const [userList, setUserList] = useState<UserList[]>([]);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [selectedId, setSelectedId] = useState<string>('');
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
    setSearch(true);
    const result = await ListUserRequest({
      filter: '',
      loggedUserId: loggedUser?.id ?? '',
      skip: (value - 1) * 4,
    });
    if (result) {
      setUserList(result.users);
      setTotalPage(result.totalPages);
    }
  };

  const handleData = useCallback(
    async (data: ListUserDto) => {
      try {
        const result = await ListUserRequest({
          filter: data.filter,
          loggedUserId: data.loggedUserId,
        });

        if (result) {
          setUserList(result.users);
          setTotalPage(result.totalPages);
        }
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

  const searchData = async (input: string) => {
    setSearch(true);
    await handleData({
      loggedUserId: loggedUser?.id ?? '',
      filter: input,
    });
  };

  useEffect(() => {
    if (!search) {
      handleData({
        filter: '',
        loggedUserId: loggedUser?.id ?? '',
      });
    }
  }, [handleData, loggedUser, search]);

  return (
    <>
      <DeleteUserModal
        open={deleteUserPopUp}
        handlePopUpClose={() => setDeleteUserPopUp(false)}
        showAlert={showAlert}
        title="Deletar Usuário"
        idToDelete={selectedId}
      />
      <EditUserModal
        open={editUserPopUp}
        handlePopUpClose={() => setEditUserPopUp(false)}
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
          <List>
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
