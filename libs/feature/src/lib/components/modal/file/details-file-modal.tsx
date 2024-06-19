import { Box, TextField, useMediaQuery, useTheme } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { SimpleModal } from '../simple';
import {
  ContentFile,
  DetailsContentFileDto,
  ErrorResponse,
} from '@workspaces/domain';
import { DetailsContentFileRequest } from '../../../services';
import axios, { AxiosError } from 'axios';
import {
  ConnectionError,
  EntityNotEmpty,
  EntityNotExist,
} from '../../../shared';

interface DetailsFileModalPros {
  showErrorAlert: (message: string) => void;
  handlePopUpClose: () => void;
  open: boolean;
  directoryId: string;
  idDetails: string;
  loggedUserId: string;
}

export const DetailsFileModal: FC<DetailsFileModalPros> = ({
  showErrorAlert,
  handlePopUpClose,
  open,
  directoryId,
  idDetails,
  loggedUserId,
}) => {
  const [contentFile, setContentFile] = useState<ContentFile>();
  const theme = useTheme();
  const mdDown = useMediaQuery(theme.breakpoints.down('md'));
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  // useEffect(() => {
  //   getContentFile();
  // }, [contentFile]);

  const getContentFile = async () => {
    try {
      const dto: DetailsContentFileDto = {
        directoryId,
        id: idDetails,
        loggedUserId,
      };
      const result = await DetailsContentFileRequest(dto);
      setContentFile(result);
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        switch (axiosError.response?.data.error.name) {
          case 'EntityNotEmpty':
            showErrorAlert(EntityNotEmpty('Arquivos', 'PT-BR'));
            break;

          case 'EntityNotExists':
            showErrorAlert(EntityNotExist('Diretorio', 'PT-BR'));
            break;

          default:
            showErrorAlert(ConnectionError('PT-BR'));
            break;
        }
      }
    }
  };

  return (
    <SimpleModal
      open={open}
      close={handlePopUpClose}
      title="Deletar Arquivo?"
      subTitle="Caso você deseje realmente deletar o aquivo por favor indicar:"
      height={25}
      width={smDown ? 30 : mdDown ? 40 : 60}
    >
      <Box>
        <TextField value={contentFile?.id} />
      </Box>
    </SimpleModal>
  );
};
