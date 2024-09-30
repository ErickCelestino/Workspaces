import { List, useTheme } from '@mui/material';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import {
  UserListItem,
  ToolbarPureTV,
  EmptyListResponse,
  UserModals,
} from '../../components';
import { LayoutBase } from '../../layout';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CrudType } from '@workspaces/domain';
import { useListUserData, useSnackbarAlert } from '../../hooks';
import { useLoggedUser } from '../../contexts';
import { ContainerSimpleList } from '../utils';

export const ListUserContainer = () => {
  const [selectedId, setSelectedId] = useState<string>('');
  const theme = useTheme();
  const { loggedUser } = useLoggedUser();
  const { showSnackbarAlert, SnackbarAlert } = useSnackbarAlert();
  const [openModal, setOpenModal] = useState({
    create: false,
    delete: false,
    edit: false,
    'add-company': false,
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

  const { getListUserData, listUsers, totalPage } = useListUserData({
    showAlert,
    loggedUserId: loggedUser?.id ?? '',
  });

  const handleChange = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    getListUserData('', value);
  };

  const handlePopUpOpen = async (
    type: CrudType | 'add-company',
    id?: string
  ) => {
    setSelectedId(id ?? '');
    setOpenModal((prev) => ({
      ...prev,
      [type]: true,
    }));
  };

  const handlePopUpClose = async (type: CrudType | 'add-company') => {
    setOpenModal((prev) => ({
      ...prev,
      [type]: false,
    }));
    getListUserData();
  };

  const searchData = async (input: string) => {
    getListUserData(input);
  };

  useEffect(() => {
    if (!hasLoadedUserData.current) {
      getListUserData();
      hasLoadedUserData.current = true;
    }
  }, [getListUserData]);

  return (
    <>
      <UserModals
        handlePopUpClose={handlePopUpClose}
        openModal={openModal}
        showAlert={showAlert}
        selectedId={selectedId}
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
            {listUsers.length > 0 ? (
              listUsers.map((user) => (
                <UserListItem
                  inModal={false}
                  deleteUser={async () =>
                    handlePopUpOpen('delete', user.userId)
                  }
                  editUser={async () => handlePopUpOpen('edit', user.userId)}
                  addUserToAnotherCompany={async () =>
                    handlePopUpOpen('add-company', user.userId)
                  }
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
