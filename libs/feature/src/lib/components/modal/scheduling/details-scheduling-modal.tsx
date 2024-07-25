import { FC, useCallback, useEffect, useState } from 'react';
import { useLoggedUser } from '../../../contexts';
import {
  ErrorResponse,
  FindSchedulingByIdDto,
  ListPlaylist,
  ListPlaylistBySchedulingIdDto,
  Playlist,
  Scheduling,
} from '@workspaces/domain';
import {
  FindSchedulingByIdRequest,
  ListPlaylistBySchedulingIdRequest,
} from '../../../services';
import axios, { AxiosError } from 'axios';
import { ValidationsError } from '../../../shared';
import { SimpleFormModal } from '../simple';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { DetailsSchedulingCard } from '../../card';
import { ListSimplePlaylist } from '../../list';

interface DetailsSchedulingModalProps {
  open: boolean;
  title: string;
  handlePopUpClose: () => void;
  showAlert: (message: string, success: boolean) => void;
  idToDetails: string;
  createByTitle?: string;
  createAtTitle?: string;
  startTimeTitle?: string;
  endTimeTitle?: string;
  loopingTitle?: string;
  priorityTitle?: string;
  listEmpty?: string;
}

export const DetailsSchedulingModal: FC<DetailsSchedulingModalProps> = ({
  handlePopUpClose,
  showAlert,
  open,
  title,
  idToDetails,
  createByTitle = 'Criado por: ',
  createAtTitle = 'Criado em: ',
  startTimeTitle = 'Início: ',
  endTimeTitle = 'Fim: ',
  loopingTitle = 'Repetir: ',
  priorityTitle = 'Prioridade: ',
  listEmpty = 'Sem Playlist',
}) => {
  const { loggedUser } = useLoggedUser();
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const [dataLoaded, setDataLoaded] = useState(false);
  const [schedulingDetails, setSchedulingDetails] = useState<Scheduling>(
    {} as Scheduling
  );
  const [playlistList, setPlaylistList] = useState<Playlist[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (!open) {
      setDataLoaded(false);
    }
  }, [open]);

  const getScheduling = useCallback(
    async (input: FindSchedulingByIdDto) => {
      try {
        const result = await FindSchedulingByIdRequest(input);
        setSchedulingDetails(result);
        setDataLoaded(true);
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ErrorResponse>;
          const errors = ValidationsError(axiosError, 'Agendamento');
          if (errors) {
            showAlert(errors, false);
          }
        }
      }
    },
    [showAlert]
  );

  const getPlaylist = useCallback(
    async (input: ListPlaylistBySchedulingIdDto) => {
      try {
        const result = await ListPlaylistBySchedulingIdRequest(input);
        setPlaylistList(result.playlists);
        setTotalPages(result.totalPages);
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
    if (open && idToDetails && !dataLoaded) {
      const loggedUserId = loggedUser?.id ?? '';

      getScheduling({
        id: idToDetails,
        loggedUserId: loggedUserId,
      });

      getPlaylist({
        id: idToDetails,
        filter: '',
        loggedUserId: loggedUserId,
      });
    }
  }, [loggedUser, idToDetails, dataLoaded, open, getScheduling, getPlaylist]);

  const handleChange = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    const result = await ListPlaylistBySchedulingIdRequest({
      filter: '',
      id: idToDetails,
      loggedUserId: loggedUser?.id ?? '',
      skip: (value - 1) * 6,
    });
    setTotalPages(result.totalPages);
    setPlaylistList(result.playlists);
  };

  return (
    <SimpleFormModal
      height={theme.spacing(70)}
      width={smDown ? '90%' : theme.spacing(80)}
      open={open}
      handlePopUpClose={handlePopUpClose}
      title={title}
    >
      <DetailsSchedulingCard
        createAtTitle={createAtTitle}
        createByTitle={createByTitle}
        endTimeTitle={endTimeTitle}
        loopingTitle={loopingTitle}
        priorityTitle={priorityTitle}
        startTimeTitle={startTimeTitle}
        schedulingDetails={schedulingDetails}
      />
      <Box>
        {playlistList.length > 0 ? (
          <Box>
            <ListSimplePlaylist
              showAlert={showAlert}
              playlists={playlistList}
              totalPages={totalPages}
              handleChange={handleChange}
            />
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h4">
              <strong>{listEmpty}</strong>
            </Typography>
          </Box>
        )}
      </Box>
    </SimpleFormModal>
  );
};
