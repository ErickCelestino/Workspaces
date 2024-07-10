import { FC, useCallback, useEffect, useState } from 'react';
import { SimpleFormModal } from '../simple';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import {
  ContentFile,
  ErrorResponse,
  ListContentFileDto,
  ListDirectoryNameResponseDto,
  ListSimpleDirectoryDto,
} from '@workspaces/domain';
import {
  ListContentFilesRequest,
  ListSimpleDirectoryRequest,
} from '../../../services';
import axios, { AxiosError } from 'axios';
import { ValidationsError } from '../../../shared';
import { useLoggedUser } from '../../../contexts';
import { ListSimpleDirectory } from '../../list';

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
        loggedUserId: loggedUser?.id ?? '',
        userInput: '',
      });
    }
  }, [dataLoaded, idPlaylist, open]);

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
        />
      </Box>
    </SimpleFormModal>
  );
};
