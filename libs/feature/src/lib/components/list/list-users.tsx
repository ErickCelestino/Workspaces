import {
  Avatar,
  Box,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Button,
  useTheme,
} from '@mui/material';
import { FC } from 'react';

interface ListUserProps {
  image: string;
  imageAlt: string;
  name: string;
  userId: string;
  email: string;
  nickname: string;
  editUser?: () => void;
}

export const ListUser: FC<ListUserProps> = ({
  image,
  imageAlt,
  name,
  userId,
  email,
  nickname,
  editUser,
}) => {
  const theme = useTheme();
  return (
    <List>
      <ListItem>
        <ListItemAvatar>
          <Avatar alt={imageAlt} src={image} />
        </ListItemAvatar>
        <ListItemText>
          <Typography>{userId}</Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Typography>{name}</Typography>
            <Box marginBottom={theme.spacing(2)}>
              <Button
                onClick={editUser}
                sx={{ marginRight: theme.spacing(0.5) }}
                variant="outlined"
                color="warning"
              >
                Editar
              </Button>
              <Button variant="outlined" color="error">
                Excluir
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Typography>{nickname}</Typography>
            <Typography>{email}</Typography>
          </Box>
        </ListItemText>
      </ListItem>
      <Divider variant="inset" component="li" />
    </List>
  );
};
