import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { IconMenuItem, ImageCardItem } from '@workspaces/domain';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import { FC } from 'react';
import { ButtonFileMenu } from '../menu';

interface ListPlaylistProps {
  name: string;
  deleteTitle?: string;
  detailsTitle?: string;
  imageData: ImageCardItem;
  deletePlaylist: () => Promise<void>;
  detailsPlaylist: () => Promise<void>;
}

export const PlaylistCard: FC<ListPlaylistProps> = ({
  name,
  deleteTitle = 'Deletar',
  detailsTitle = 'Detalhes',
  imageData,
  deletePlaylist,
  detailsPlaylist,
}) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const iconMenuList: IconMenuItem[] = [
    {
      icon: <InfoIcon />,
      title: detailsTitle,
      handleClick: detailsPlaylist,
    },
    {
      icon: <DeleteIcon />,
      title: deleteTitle,
      handleClick: deletePlaylist,
    },
  ];
  return (
    <Card
      sx={{
        width: smDown ? theme.spacing(45) : theme.spacing(40),
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
