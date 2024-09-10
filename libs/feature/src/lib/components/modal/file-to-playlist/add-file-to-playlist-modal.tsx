import { FC, useCallback, useEffect, useState } from 'react';
import { SimpleFormModal } from '../simple';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import {
  ErrorResponse,
  ListDirectoryNameResponseDto,
  ListSimpleDirectoryDto,
} from '@workspaces/domain';
import { ListSimpleDirectoryRequest } from '../../../services';
import axios, { AxiosError } from 'axios';
import { ValidationsError } from '../../../shared';
import { useLoggedUser } from '../../../contexts';
import { ListSimpleDirectory } from '../../list';
import { AddFileToPlaylistRequest } from '../../../services/http/file-to-playlist/add-file-to-playlist';

interface AddFileToPlaylistModalProps {
  showAlert: (message: string, success: boolean) => void;
  handlePopUpClose: () => void;
  title: string;
  idPlaylist: string;
  open: boolean;
  successMessage?: string;
}

export const AddFileToPlaylistModal: FC<AddFileToPlaylistModalProps> = ({
  handlePopUpClose,
  showAlert,
  idPlaylist,
  title,
  open,
  successMessage = 'Arquivo(s) Adicionado(s) com Sucesso!',
}) => {
  const [directoriesList, setDirectoriesList] = useState<
    ListDirectoryNameResponseDto[]
  >([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const { loggedUser } = useLoggedUser();

  useEffect(() => {
    if (!open) {
      setDataLoaded(false);
    }
  }, [open]);

  const addFileToPlaylist = async (data: string[]) => {
    if (data.length > 0) {
      try {
        const result = await AddFileToPlaylistRequest({
          loggedUserId: loggedUser?.id ?? '',
          filesId: data,
          playlistId: idPlaylist,
        });

        if (result) {
          showAlert(successMessage, true);
          handlePopUpClose();
        }
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ErrorResponse>;
          const errors = ValidationsError(axiosError, 'Arquivo(s)');
          if (errors) {
            showAlert(errors, false);
          }
        }
      }
    }
  };

  const getDirectory = useCallback(
    async (input: ListSimpleDirectoryDto) => {
      try {
        const result = await ListSimpleDirectoryRequest(input);
        setDirectoriesList(result.directories);
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ErrorResponse>;
          const errors = ValidationsError(axiosError, 'Directory');
          if (errors) {
            showAlert(errors, false);
          }
        }
      }
    },
    [showAlert]
  );

  useEffect(() => {
    if (open && idPlaylist && !dataLoaded) {
      getDirectory({
        companyId: loggedUser?.selectedCompany.id ?? '',
        loggedUserId: loggedUser?.id ?? '',
        userInput: '',
      });
    }
  }, [dataLoaded, idPlaylist, open, getDirectory, loggedUser]);

  return (
    <SimpleFormModal
      height={smDown ? theme.spacing(55) : theme.spacing(70)}
      width={smDown ? '90%' : theme.spacing(80)}
      open={open}
      handlePopUpClose={handlePopUpClose}
      title={title}
    >
      <Box>
        <ListSimpleDirectory
          listDirectories={directoriesList}
          showAlert={showAlert}
          addFileToPlaylist={addFileToPlaylist}
        />
      </Box>
    </SimpleFormModal>
  );
};
