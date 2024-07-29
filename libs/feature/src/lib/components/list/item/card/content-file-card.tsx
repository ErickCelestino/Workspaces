import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  useTheme,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import { FC } from 'react';
import { IconMenuItem } from '@workspaces/domain';
import { ButtonFileMenu } from '../../../menu';

interface ListContentFilesProps {
  fileImage: string;
  name: string;
  fileImageName: string;
  deleteFile: () => Promise<void>;
  downloadFile: () => Promise<void>;
  detailsFile: () => Promise<void>;
  moveFile: () => Promise<void>;
}

export const ContentFileCard: FC<ListContentFilesProps> = ({
  fileImage,
  name,
  fileImageName,
  deleteFile,
  downloadFile,
  detailsFile,
  moveFile,
}) => {
  const theme = useTheme();

  const iconMenuList: IconMenuItem[] = [
    {
      icon: <InfoIcon />,
      title: 'Detalhes',
      handleClick: detailsFile,
    },
    {
      icon: <DeleteIcon />,
      title: 'Deletar',
      handleClick: deleteFile,
    },
    {
      icon: <DownloadIcon />,
      title: 'Download',
      handleClick: downloadFile,
    },
    {
      icon: <DriveFileMoveIcon />,
      title: 'Mover para',
      handleClick: moveFile,
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
        image={fileImage ?? '/assets/images/Sem_Arquivo.png'}
        title={fileImageName}
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
        </CardContent>
        <CardActions>
          <ButtonFileMenu iconMenuItemList={iconMenuList} />
        </CardActions>
      </Box>
    </Card>
  );
};
