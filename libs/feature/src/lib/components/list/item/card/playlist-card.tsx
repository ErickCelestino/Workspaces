import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  useTheme,
} from '@mui/material';
import {
  ErrorResponse,
  FindFilesByPlaylistDto,
  IconMenuItem,
  ImageCardItem,
} from '@workspaces/domain';
import EditIcon from '@mui/icons-material/Edit';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import { FC, useCallback, useEffect, useState } from 'react';
import { ButtonFileMenu } from '../../../menu';
import { FindFilesByPlaylistRequest } from '../../../../services';
import { useLoggedUser } from '../../../../contexts';
import { ValidationsError } from '../../../../shared';
import axios, { AxiosError } from 'axios';

interface ListPlaylistProps {
  name: string;
  editTitle?: string;
  deleteTitle?: string;
  addFileTitle?: string;
  detailsTitle?: string;
  idPlaylist: string;
  editPlaylist: () => Promise<void>;
  deletePlaylist: () => Promise<void>;
  addFile: () => Promise<void>;
  detailsPlaylist: () => Promise<void>;
  showAlert: (message: string, success: boolean) => void;
}

export const PlaylistCard: FC<ListPlaylistProps> = ({
  name,
  editTitle = 'Editar',
  deleteTitle = 'Deletar',
  addFileTitle = 'Adicionar Arquivos',
  detailsTitle = 'Detalhes',
  idPlaylist,
  editPlaylist,
  deletePlaylist,
  addFile,
  detailsPlaylist,
  showAlert,
}) => {
  const theme = useTheme();
  const { loggedUser } = useLoggedUser();
  const [imageData, setImageData] = useState<ImageCardItem>(
    {} as ImageCardItem
  );

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
      icon: <InfoIcon />,
      title: detailsTitle,
      handleClick: detailsPlaylist,
    },
    {
      icon: <NoteAddIcon />,
      title: addFileTitle,
      handleClick: addFile,
    },
  ];

  const getImage = useCallback(
    async (input: FindFilesByPlaylistDto) => {
      try {
        const result = await FindFilesByPlaylistRequest({
          idPlaylist: input.idPlaylist,
          loggedUserId: input.loggedUserId,
        });

        if (result) {
          setImageData({
            image: result?.files[0]?.path,
            imageName: result?.files[0]?.originalName,
          });
        }
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ErrorResponse>;
          const errors = ValidationsError(axiosError, 'Imagem');
          if (errors) {
            showAlert(errors, false);
          }
        }
      }
    },
    [showAlert]
  );

  useEffect(() => {
    getImage({
      idPlaylist,
      loggedUserId: loggedUser?.id ?? '',
    });
  }, [idPlaylist, loggedUser, getImage]);

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
        image={imageData.image ?? '/assets/images/Sem_Arquivo.png'}
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
