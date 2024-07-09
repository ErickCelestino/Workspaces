import { FC, useCallback, useEffect, useState } from 'react';
import { SimpleFormModal } from '../simple';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import {
  ContentFile,
  ErrorResponse,
  ListContentFileDto,
} from '@workspaces/domain';
import { ListContentFilesRequest } from '../../../services';
import axios, { AxiosError } from 'axios';
import { ValidationsError } from '../../../shared';

interface AddFileToPlaylistModalProps {
  showAlert: (message: string, success: boolean) => void;
  handlePopUpClose: () => void;
  title: string;
  idPlaylist: string;
  loggedUserId: string;
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
  const [filesList, setFilesList] = useState<ContentFile[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (!open) {
      setDataLoaded(false);
    }
  }, [open]);

  const getFiles = useCallback(
    async (input: ListContentFileDto) => {
      try {
        const result = await ListContentFilesRequest(input);
        setFilesList(result.files);
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ErrorResponse>;
          const errors = ValidationsError(axiosError, 'Category');
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
      console.log('more inplementation');
    }
  }, [getFiles, dataLoaded, idPlaylist, open]);

  return (
    <SimpleFormModal
      height={smDown ? theme.spacing(55) : theme.spacing(53)}
      width={smDown ? '90%' : theme.spacing(80)}
      open={open}
      handlePopUpClose={handlePopUpClose}
      title={title}
    >
      <Box></Box>
    </SimpleFormModal>
  );
};
