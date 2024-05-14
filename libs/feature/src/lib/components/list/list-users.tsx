import {
  Avatar,
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
}

export const ListUser: FC<ListUserProps> = ({ image, imageAlt, name }) => {
  return (
    <List>
      <ListItem>
        <ListItemAvatar>
          <Avatar alt={imageAlt} src={image} />
        </ListItemAvatar>
        <ListItemText>
          <Typography>{name}</Typography>
        </ListItemText>
      </ListItem>
      <Divider variant="inset" component="li" />
    </List>
  );
};
