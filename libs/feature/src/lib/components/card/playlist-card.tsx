import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  useTheme,
} from '@mui/material';
import { IconMenuItem, ImageCardItem } from '@workspaces/domain';
import EditIcon from '@mui/icons-material/Edit';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import { FC } from 'react';
import { ButtonFileMenu } from '../menu';

interface ListPlaylistProps {
  name: string;
  editTitle?: string;
  deleteTitle?: string;
  addFileTitle?: string;
  imageData: ImageCardItem;
  editPlaylist: () => Promise<void>;
  deletePlaylist: () => Promise<void>;
  addFile: () => Promise<void>;
}

export const PlaylistCard: FC<ListPlaylistProps> = ({
  name,
  editTitle = 'Editar',
  deleteTitle = 'Deletar',
  addFileTitle = 'Adicionar Arquivos',
  imageData,
  editPlaylist,
  deletePlaylist,
  addFile,
}) => {
  const theme = useTheme();

  const iconMenuList: IconMenuItem[] = [
    {
      icon: <EditIcon />,
      title: editTitle,
      handleClick: editPlaylist,
    },
    {
      icon: <DeleteIcon />,
      title: deleteTitle,
      handleClick: deletePlaylist,
    },
    {
      icon: <NoteAddIcon />,
      title: addFileTitle,
      handleClick: addFile,
    },
  ];
  return (
    <Card
      sx={{
        width: theme.spacing(40),
        height: theme.spacing(28),
        margin: theme.spacing(2),
      }}
    >
      <CardMedia
        component="img"
        image={imageData.image}
        title={imageData.imageName}
        sx={{
          height: theme.spacing(15),
          objectFit: 'contain',
          objectPosition: 'center',
          margin: 'auto',
        }}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <CardContent>
          <Box>
            <Typography
              component="div"
              variant="body2"
              overflow="hidden"
              noWrap
              width={theme.spacing(20)}
              textOverflow="ellipsis"
              fontSize={14}
            >
              {name}
            </Typography>
          </Box>
        </CardContent>
        <CardActions>
          <ButtonFileMenu iconMenuItemList={iconMenuList} />
        </CardActions>
      </Box>
    </Card>
  );
};
