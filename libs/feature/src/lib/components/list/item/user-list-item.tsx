import {
  Avatar,
  Box,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  useTheme,
  Chip,
  useMediaQuery,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IconMenuItem, StatusColor, UserList } from '@workspaces/domain';
import { FC } from 'react';
import { ButtonFileMenu } from '../../menu';

interface UserListItemProps {
  user: UserList;
  inModal: boolean;
  statusColor: StatusColor;
  editUser?: () => Promise<void>;
  deleteUser?: () => Promise<void>;
  deleteUserTitle?: string;
  editUserTitle?: string;
  nicknameTitle?: string;
  statusTitle?: string;
  idTitle?: string;
  emailTitle?: string;
}

export const UserListItem: FC<UserListItemProps> = ({
  user,
  statusColor,
  inModal,
  editUser,
  deleteUser,
  deleteUserTitle = 'Deletar',
  editUserTitle = 'Editar',
  nicknameTitle = 'Nickname',
  statusTitle = 'Status',
  idTitle = 'ID',
  emailTitle = 'Email',
}) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const iconMenuList: IconMenuItem[] = [];

  if (deleteUser) {
    iconMenuList.push({
      icon: <DeleteIcon />,
      title: deleteUserTitle,
      handleClick: deleteUser,
    });
  }

  if (editUser) {
    iconMenuList.push({
      icon: <EditIcon />,
      title: editUserTitle,
      handleClick: editUser,
    });
  }

  return (
    <Box width="100%" key={user.userId}>
      <ListItem key={user.userId}>
        {!smDown && (
          <ListItemAvatar>
            <Avatar
              component="span"
              sx={{
                width: theme.spacing(7),
                height: theme.spacing(7),
                marginRight: theme.spacing(2),
              }}
              alt={user.name}
              src={''}
            />
          </ListItemAvatar>
        )}
        <ListItemText
          primary={user.name}
          secondary={
            <Box
              component="span"
              sx={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box
                component="span"
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box component="span">
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {idTitle}:
                  </Typography>
                  <Typography
                    sx={{ display: 'inline', marginLeft: theme.spacing(1) }}
                    component="span"
                    variant="body2"
                    color="text.secondary"
                  >
                    {user.userId}
                  </Typography>
                </Box>
                {!inModal && (
                  <Box component="span">
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {statusTitle}:
                    </Typography>
                    <Chip
                      component="span"
                      sx={{
                        marginLeft: theme.spacing(1),
                      }}
                      color={statusColor}
                      label={user.status}
                    />
                  </Box>
                )}
              </Box>
              <Box
                component="span"
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: theme.spacing(1),
                }}
              >
                <Box component="span">
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {nicknameTitle}:
                  </Typography>
                  <Typography
                    sx={{ display: 'inline', marginLeft: theme.spacing(1) }}
                    component="span"
                    variant="body2"
                    color="text.secondary"
                  >
                    {user.nickname}
                  </Typography>
                </Box>
                {!inModal && (
                  <Box component="span">
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {emailTitle}:
                    </Typography>
                    <Typography
                      sx={{ display: 'inline', marginLeft: theme.spacing(1) }}
                      component="span"
                      variant="body2"
                      color="text.secondary"
                    >
                      {user.email}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          }
        />
        <Box
          sx={{
            marginLeft: smDown ? 0 : theme.spacing(2),
          }}
        >
          <ButtonFileMenu iconMenuItemList={iconMenuList} />
        </Box>
      </ListItem>
      <Divider
        variant="inset"
        component="li"
        sx={{
          marginLeft: inModal ? 0 : 'auto',
        }}
      />
    </Box>
  );
};
