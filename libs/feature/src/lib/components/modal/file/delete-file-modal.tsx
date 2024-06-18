import { Box, Button, useMediaQuery, useTheme } from '@mui/material';
import { SimpleModal } from '../simple';
import { FC } from 'react';
import axios, { AxiosError } from 'axios';
import { DeleteContentFileByIdDto, ErrorResponse } from '@workspaces/domain';
import { DeleteContentFileByIdRequest } from '../../../services';
import {
  EntityNotEmpty,
  EntityNotExist,
  ConnectionError,
} from '../../../shared';

interface DeleteFileModalProps {
  showErrorAlert: (message: string) => void;
  handlePopUpClose: () => void;
  directoryId: string;
  idToDelete: string;
  loggedUserId: string;
  deletePopUp: boolean;
  onDeleteSuccess: () => void;
}

export const DeleteFileModal: FC<DeleteFileModalProps> = ({
  showErrorAlert,
  handlePopUpClose,
  onDeleteSuccess,
  directoryId,
  idToDelete,
  loggedUserId,
  deletePopUp,
}) => {
  const theme = useTheme();
  const mdDown = useMediaQuery(theme.breakpoints.down('md'));
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const deleteFile = async () => {
    try {
      const dto: DeleteContentFileByIdDto = {
        directoryId,
        loggedUserId,
        idToDelete,
      };
      await DeleteContentFileByIdRequest(dto);
      handlePopUpClose();
      onDeleteSuccess();
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
      open={deletePopUp}
      close={handlePopUpClose}
      title="Deletar Arquivo?"
      subTitle="Caso você deseje realmente deletar o aquivo por favor indicar:"
      height={25}
      width={smDown ? 30 : mdDown ? 40 : 60}
    >
      <Box>
        <Button
          onClick={deleteFile}
          variant="contained"
          color="success"
          sx={{
            marginRight: theme.spacing(2),
          }}
        >
          Sim
        </Button>
        <Button onClick={handlePopUpClose} variant="contained" color="error">
          Não
        </Button>
      </Box>
    </SimpleModal>
  );
};
