import { FC, useCallback, useEffect, useState } from 'react';
import { useLoggedUser } from '../../../contexts';
import {
  Box,
  Checkbox,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
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
  playlistTitle?: string;
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
  playlistTitle = 'Selecione as Playlists',
  successMessage = 'Playlists Adicionada com Sucesso',
}) => {
  const { loggedUser } = useLoggedUser();
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const [dataLoaded, setDataLoaded] = useState(false);
  const [listPlaylist, setListPlaylist] = useState<Playlist[]>([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);

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

  const handlePlaylistToggle = (playlistId: string) => {
    const currentIndex = selectedPlaylists.indexOf(playlistId);
    const newChecked = [...selectedPlaylists];

    if (currentIndex === -1) {
      newChecked.push(playlistId);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setSelectedPlaylists(newChecked);
  };

  return (
    <SimpleFormModal
      height={smDown ? theme.spacing(55) : theme.spacing(80)}
      width={smDown ? '90%' : theme.spacing(80)}
      open={open}
      handlePopUpClose={handlePopUpClose}
      title={title}
    >
      <Box>
        {listPlaylist.length > 0 ? (
          <>
            <Typography mt={theme.spacing(1)} variant="h6">
              {playlistTitle}
            </Typography>
            <List>
              {listPlaylist.map((playlist) => (
                <ListItem key={playlist.id}>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={selectedPlaylists.indexOf(playlist.id) !== -1}
                      onChange={() => handlePlaylistToggle(playlist.id)}
                    />
                  </ListItemIcon>

                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}
                  >
                    <ListItemText primary={playlist.name} />
                    <Chip
                      sx={{
                        marginTop: theme.spacing(1),
                        fontSize: theme.spacing(2),
                      }}
                      component="span"
                      label={playlist.category}
                      color="secondary"
                      variant="filled"
                    />
                  </Box>
                </ListItem>
              ))}
            </List>
          </>
        ) : (
          <Box>"Sem Playlists"</Box>
        )}
      </Box>
    </SimpleFormModal>
  );
};
