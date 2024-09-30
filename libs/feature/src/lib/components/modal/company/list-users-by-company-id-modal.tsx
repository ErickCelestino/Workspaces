import { FC, useEffect, useRef, useState } from 'react';
import { List, useMediaQuery, useTheme } from '@mui/material';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import { SimpleFormModal } from '../simple';
import { EmptyListResponse, UserListItem } from '../../list';
import { useLoggedUser } from '../../../contexts';
import { useListUsersByCompanyIdData } from '../../../hooks';
import { ContainerListModal } from '../list';
import { ScrollBox } from '../../scroll';
import { CrudType } from '@workspaces/domain';
import { UserModals } from '../user';

interface EditCompanyModalProps {
  open: boolean;
  title: string;
  companyId: string;
  handlePopUpClose: () => void;
  showAlert: (message: string, success: boolean) => void;
}

export const ListUsersByCompanyIdModal: FC<EditCompanyModalProps> = ({
  open,
  title,
  companyId,
  handlePopUpClose,
  showAlert,
}) => {
  const theme = useTheme();
  const { loggedUser } = useLoggedUser();
  const hasLoadedUserData = useRef(false);
  const [openModal, setOpenModal] = useState({
    create: false,
    delete: false,
    edit: false,
    'add-company': false,
  });
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedId, setSelectedId] = useState<string>('');

  const { getListCompanyData, totalPage, listUsersByCompanyId } =
    useListUsersByCompanyIdData({
      companyId,
      loggedUserId: loggedUser?.id ?? '',
      showAlert,
    });

  useEffect(() => {
    if (open && companyId && !hasLoadedUserData.current) {
      hasLoadedUserData.current = true;
      getListCompanyData();
    }
  }, [loggedUser, companyId, open, getListCompanyData]);

  const searchData = async (input: string) => {
    getListCompanyData(input);
  };

  const handleChange = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    getListCompanyData('', value);
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

  const handleUserPopUpClose = async (type: CrudType | 'add-company') => {
    setOpenModal((prev) => ({
      ...prev,
      [type]: false,
    }));
    getListCompanyData();
  };

  return (
    <>
      <UserModals
        handlePopUpClose={handleUserPopUpClose}
        openModal={openModal}
        showAlert={showAlert}
        selectedId={selectedId}
      />
      <SimpleFormModal
        open={open}
        handlePopUpClose={handlePopUpClose}
        height="auto"
        width={smDown ? '90%' : theme.spacing(90)}
        title={title}
      >
        <ContainerListModal
          search={{
            placeholder: 'Pesquisar por Usuário',
            searchData: searchData,
          }}
          totalPage={totalPage}
          handleChange={handleChange}
        >
          <ScrollBox maxHeight="80%">
            <List
              sx={{
                width: '100%',
              }}
            >
              {listUsersByCompanyId.length > 0 ? (
                listUsersByCompanyId.map((user) => (
                  <UserListItem
                    key={user.userId}
                    user={user}
                    inModal={true}
                    addUserToAnotherCompany={async () =>
                      handlePopUpOpen('add-company', user.userId)
                    }
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
          </ScrollBox>
        </ContainerListModal>
      </SimpleFormModal>
    </>
  );
};
