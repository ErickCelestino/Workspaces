import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  useTheme,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { FC } from 'react';
import { ButtonFileMenu } from '../../../menu';
import { IconMenuItem } from '@workspaces/domain';

interface DeviceCardProps {
  name: string;
  editTitle?: string;
  deleteTitle?: string;
  deleteDevice: () => Promise<void>;
  editDevice: () => Promise<void>;
}

export const DeviceCard: FC<DeviceCardProps> = ({
  name,
  deleteDevice,
  editDevice,
  editTitle = 'Editar',
  deleteTitle = 'Deletar',
}) => {
  const theme = useTheme();

  const iconMenuList: IconMenuItem[] = [
    {
      icon: <DeleteIcon />,
      title: deleteTitle,
      handleClick: deleteDevice,
    },
    {
      icon: <EditIcon />,
      title: editTitle,
      handleClick: editDevice,
    },
  ];

  return (
    <Card
      sx={{
        height: theme.spacing(28),
        maxWidth: 345,
        minWidth: theme.spacing(40),
        margin: 'auto',
      }}
    >
      <CardMedia
        component="img"
        image={'/assets/images/Sem_Arquivo.png'}
        title={name}
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
