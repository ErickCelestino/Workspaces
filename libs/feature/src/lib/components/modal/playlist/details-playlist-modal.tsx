import { FC, useCallback, useEffect, useState } from 'react';
import { SimpleFormModal } from '../simple';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import {
  ContentFile,
  DetailsPlaylistDto,
  ErrorResponse,
  ListContentFileDto,
  PlaylistResponseDto,
} from '@workspaces/domain';
import {
  DetailsPlaylistRequest,
  ListContentFilesRequest,
} from '../../../services';
import axios, { AxiosError } from 'axios';
import { formatBrDate, ValidationsError } from '../../../shared';
import { useLoggedUser } from '../../../contexts';

interface DetailsPlaylistModalProps {
  open: boolean;
  title: string;
  idPlaylist: string;
  handlePopUpClose: () => void;
  showAlert: (message: string, success: boolean) => void;
}

export const DetailsPlaylistModal: FC<DetailsPlaylistModalProps> = ({
  handlePopUpClose,
  showAlert,
  idPlaylist,
  title,
  open,
}) => {
  const [playlistDetails, setPlaylistDetails] = useState<PlaylistResponseDto>(
    {} as PlaylistResponseDto
  );
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
    }
  }, [open, idPlaylist, dataLoaded, getPlaylist, loggedUser]);

  return (
    <SimpleFormModal
      height={smDown ? theme.spacing(55) : theme.spacing(53)}
      width={smDown ? '90%' : theme.spacing(80)}
      open={open}
      handlePopUpClose={handlePopUpClose}
      title={title}
    >
      <Box>
        <Typography>{playlistDetails?.name ?? ''}</Typography>
        <Typography>{playlistDetails.category?.name ?? ''}</Typography>
        <Typography>
          {formatBrDate(new Date(playlistDetails?.created_at ?? new Date()))}
        </Typography>
      </Box>
    </SimpleFormModal>
  );
};
