import { FC, useCallback, useEffect, useState } from 'react';
import { useLoggedUser } from '../../../contexts';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { ErrorResponse, ListPlaylistDto, Playlist } from '@workspaces/domain';
import { ListPlaylistRequest } from '../../../services';
import axios, { AxiosError } from 'axios';
import { ValidationsError } from '../../../shared';
import { SimpleFormModal } from '../simple';

interface AddPlaylistToSchedulingModalProps {
  open: boolean;
  title: string;
  idScheduling: string;
  handlePopUpClose: () => void;
  showAlert: (message: string, success: boolean) => void;
  nameLabel?: string;
  successMessage?: string;
}

export const AddPlaylistToSchedulingModal: FC<
  AddPlaylistToSchedulingModalProps
> = ({
  handlePopUpClose,
  showAlert,
  title,
  open,
  idScheduling,
  nameLabel = 'Nome',
  successMessage = 'Playlists Adicionada com Sucesso',
}) => {
  const { loggedUser } = useLoggedUser();
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const [dataLoaded, setDataLoaded] = useState(false);
  const [listPlaylist, setListPlaylist] = useState<Playlist[]>([]);

  useEffect(() => {
    if (!open) {
      setDataLoaded(false);
    }
  }, [open]);

  const getPlaylists = useCallback(
    async (input: ListPlaylistDto) => {
      try {
        const result = await ListPlaylistRequest(input);
        setListPlaylist(result.playlists);
        setDataLoaded(true);
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

  useEffect(() => {
    if (open && idScheduling && !dataLoaded) {
      getPlaylists({
        loggedUserId: loggedUser?.id ?? '',
        userInput: '',
      });
    }
  }, [open, idScheduling, dataLoaded, getPlaylists, loggedUser]);

  return (
    <SimpleFormModal
      height={smDown ? theme.spacing(55) : theme.spacing(80)}
      width={smDown ? '90%' : theme.spacing(80)}
      open={open}
      handlePopUpClose={handlePopUpClose}
      title={title}
    >
      <Box>te</Box>
    </SimpleFormModal>
  );
};
