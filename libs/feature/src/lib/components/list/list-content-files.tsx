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
import InfoIcon from '@mui/icons-material/Info';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import { FC } from 'react';
import { IconMenuItem } from '@workspaces/domain';
import { ButtonFileMenu } from '../menu';

interface ListContentFilesProps {
  fileImage: string;
  name: string;
  fileImageName: string;
}

export const ListContentFiles: FC<ListContentFilesProps> = ({
  fileImage,
  name,
  fileImageName,
}) => {
  const theme = useTheme();
  const mdDown = useMediaQuery(theme.breakpoints.down('md'));
  const xlDown = useMediaQuery(theme.breakpoints.down('xl'));

  const handleDetails = () => {
    //more implamentation funcion details file
  };

  const handleDelete = () => {
    //more implamentation funcion delete file
  };

  const handleDownload = () => {
    //more implamentation funcion delete file
  };

  const iconMenuList: IconMenuItem[] = [
    {
      icon: <InfoIcon />,
      title: 'Detalhes',
      handleClick: handleDetails,
    },
    {
      icon: <DeleteIcon />,
      title: 'Deletar',
      handleClick: handleDelete,
    },
    {
      icon: <DownloadIcon />,
      title: 'Download',
      handleClick: handleDownload,
    },
  ];

  return (
    <Card
      sx={{
        width: mdDown
          ? theme.spacing(30)
          : xlDown
          ? theme.spacing(32)
          : theme.spacing(40),
        height: theme.spacing(28),
        margin: theme.spacing(2),
      }}
    >
      <CardMedia
        component="img"
        image={fileImage}
        title={fileImageName}
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
