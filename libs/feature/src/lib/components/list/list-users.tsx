import {
  Avatar,
  Box,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import { FC } from 'react';

interface ListUserProps {
  image: string;
  imageAlt: string;
  name: string;
  userId: string;
  email: string;
  nickname: string;
}

export const ListUser: FC<ListUserProps> = ({
  image,
  imageAlt,
  name,
  userId,
  email,
  nickname,
}) => {
  return (
    <List>
      <ListItem>
        <ListItemAvatar>
          <Avatar alt={imageAlt} src={image} />
        </ListItemAvatar>
        <ListItemText>
          <Typography>{userId}</Typography>
          <Typography>{name}</Typography>
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
