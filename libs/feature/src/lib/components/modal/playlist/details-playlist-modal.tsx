import { FC, useCallback, useEffect, useState } from 'react';
import { SimpleFormModal } from '../simple';
import {
  Avatar,
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ContentFile,
  DetailsPlaylistDto,
  ErrorResponse,
  FindFilesByPlaylistDto,
  PlaylistResponseDto,
} from '@workspaces/domain';
import {
  DetailsPlaylistRequest,
  FindFilesByPlaylistRequest,
} from '../../../services';
import axios, { AxiosError } from 'axios';
import { formatBrDate, ValidationsError } from '../../../shared';
import { useLoggedUser } from '../../../contexts';

interface DetailsPlaylistModalProps {
  open: boolean;
  title: string;
  idPlaylist: string;
  filesTitle?: string;
  handlePopUpClose: () => void;
  showAlert: (message: string, success: boolean) => void;
}

export const DetailsPlaylistModal: FC<DetailsPlaylistModalProps> = ({
  handlePopUpClose,
  showAlert,
  idPlaylist,
  filesTitle = 'Arquivos',
  title,
  open,
}) => {
  const [playlistDetails, setPlaylistDetails] = useState<PlaylistResponseDto>(
    {} as PlaylistResponseDto
  );
  const [files, setFiles] = useState<ContentFile[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  const { loggedUser } = useLoggedUser();
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const getPlaylist = useCallback(
    async (input: DetailsPlaylistDto) => {
      try {
        const result = await DetailsPlaylistRequest(input);
        setPlaylistDetails(result);
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ErrorResponse>;
          const errors = ValidationsError(axiosError, 'Playlist');
          if (errors) {
            showAlert(errors, false);
          }
        }
      }
    },
    [showAlert]
  );

  const getFilesByPlaylist = useCallback(
    async (input: FindFilesByPlaylistDto) => {
      try {
        const result = await FindFilesByPlaylistRequest(input);
        setFiles(result.files);
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ErrorResponse>;
          const errors = ValidationsError(axiosError, 'Arquivos');
          if (errors) {
            showAlert(errors, false);
          }
        }
      }
    },
    [showAlert]
  );

  useEffect(() => {
    if (!open) {
      setDataLoaded(false);
    }
  }, [open]);

  useEffect(() => {
    if (open && idPlaylist && !dataLoaded) {
      getPlaylist({
        loggedUserId: loggedUser?.id ?? '',
        playlistId: idPlaylist,
      });
      getFilesByPlaylist({
        idPlaylist,
        loggedUserId: loggedUser?.id ?? '',
      });
    }
  }, [open, idPlaylist, dataLoaded, getPlaylist, loggedUser]);

  return (
    <SimpleFormModal
      height={smDown ? theme.spacing(55) : theme.spacing(80)}
      width={smDown ? '90%' : theme.spacing(80)}
      open={open}
      handlePopUpClose={handlePopUpClose}
      title={title}
    >
      <Box sx={{ padding: theme.spacing(2) }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: theme.spacing(2),
          }}
        >
          <Typography
            sx={{
              fontSize: '18px',
            }}
          >
            <strong>Nome: </strong>
            {playlistDetails?.name ?? ''}
          </Typography>
          <Chip
            label={playlistDetails.category?.name ?? ''}
            color="success"
            variant="filled"
            size="medium"
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            sx={{
              fontSize: '18px',
            }}
          >
            <strong>Criado por: </strong>
            {playlistDetails?.created_by ?? ''}
          </Typography>
          <Typography>
            <strong>Criado em: </strong>
            {formatBrDate(new Date(playlistDetails?.created_at ?? new Date()))}
          </Typography>
        </Box>
        <Divider
          sx={{
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
          }}
        />
        <Box>
          <Typography variant="h5">
            <strong>{filesTitle}</strong>
          </Typography>
          <List>
            {files.map((file) => (
              <ListItem key={file.id}>
                <ListItemAvatar>
                  <Avatar
                    alt={file.originalName}
                    src={file.path}
                    sx={{
                      width: theme.spacing(8),
                      height: theme.spacing(8),
                      '& img': {
                        objectFit: 'contain',
                        objectPosition: 'center',
                        maxHeight: '100%',
                        maxWidth: '100%',
                      },
                    }}
                  />
                </ListItemAvatar>

                <ListItemText
                  sx={{
                    marginLeft: theme.spacing(2),
                    overflow: 'hidden',
                    fontSize: smDown ? '8px' : '16px',
                    textOverflow: 'ellipsis',
                  }}
                  primary={file.originalName}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </SimpleFormModal>
  );
};
