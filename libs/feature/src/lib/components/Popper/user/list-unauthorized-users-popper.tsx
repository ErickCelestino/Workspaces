import { Box, List, Popper, useTheme } from '@mui/material';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import { FC, useEffect, useState } from 'react';
import { useLoggedUser } from '../../../contexts';
import { useFindUnauthorizedUsersByCompanyIdData } from '../../../hooks';
import { ScrollBox } from '../../scroll';
import { EmptyListResponse, UserListItem } from '../../list';

interface ListUnauthorizedUsersPopperProps {
  open: boolean;
  id: string;
  anchorEl: null | HTMLElement;
  showAlert: (message: string, success: boolean) => void;
}

export const ListUnauthorizedUsersPopper: FC<
  ListUnauthorizedUsersPopperProps
> = ({ id, open, anchorEl, showAlert }) => {
  const { loggedUser } = useLoggedUser();
  const theme = useTheme();
  const [dataLoaded, setDataLoaded] = useState(false);

  const { getUnauthorizedUsersByCompanyIdData, userList } =
    useFindUnauthorizedUsersByCompanyIdData({
      showAlert,
      companyId: loggedUser?.selectedCompany.id ?? '',
      loggedUserId: loggedUser?.id ?? '',
    });

  useEffect(() => {
    if (!open) {
      setDataLoaded(false);
    }
  }, [open]);

  useEffect(() => {
    if (open && id && !dataLoaded) {
      getUnauthorizedUsersByCompanyIdData();
      setDataLoaded(true);
    }
  }, [id, dataLoaded, open, getUnauthorizedUsersByCompanyIdData]);

  return (
    <Box>
      <Popper id={id} open={open} anchorEl={anchorEl}>
        <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }}>
          <ScrollBox maxHeight="80%">
            <List
              sx={{
                width: '100%',
              }}
            >
              {userList.length > 0 ? (
                userList.map((user) => (
                  <UserListItem
                    key={user.userId}
                    user={user}
                    inModal={true}
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
        </Box>
      </Popper>
    </Box>
  );
};
