import { FC, useEffect, useState } from 'react';
import { List, useMediaQuery, useTheme } from '@mui/material';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import { SimpleFormModal } from '../simple';
import { EmptyListResponse, UserListItem } from '../../list';
import { useLoggedUser } from '../../../contexts';
import { useListUsersByCompanyIdData } from '../../../hooks';
import { ContainerListModal } from '../list';

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
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const [dataLoaded, setDataLoaded] = useState(false);
  //const [selectedId, setSelectedId] = useState<string>('');

  const { getListCompanyData, totalPage, listUsersByCompanyId } =
    useListUsersByCompanyIdData({
      companyId,
      loggedUserId: loggedUser?.id ?? '',
      showAlert,
    });

  useEffect(() => {
    if (!open) {
      setDataLoaded(false);
    }
  }, [open]);

  useEffect(() => {
    if (open && companyId && !dataLoaded) {
      getListCompanyData();
    }
  }, [loggedUser, companyId, dataLoaded, open, getListCompanyData]);

  const searchData = async (input: string) => {
    getListCompanyData(input);
  };

  const handleChange = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    getListCompanyData('', value);
  };

  return (
    <SimpleFormModal
      open={open}
      handlePopUpClose={handlePopUpClose}
      height="auto"
      width={smDown ? '90%' : theme.spacing(90)}
      title={title}
    >
      <ContainerListModal
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
          {listUsersByCompanyId.length > 0 ? (
            listUsersByCompanyId.map((user) => (
              <UserListItem
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
      </ContainerListModal>
    </SimpleFormModal>
  );
};
