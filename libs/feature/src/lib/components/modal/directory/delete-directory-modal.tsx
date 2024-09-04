import { FC, useState } from 'react';
import { useLoggedUser } from '../../../contexts';
import {
  DeleteDirectoryRequest,
  ListContentFilesRequest,
} from '../../../services';
import axios, { AxiosError } from 'axios';
import { ErrorResponse } from '@workspaces/domain';
import { ValidationsError } from '../../../shared';
import { SimpleConfimationModal } from '../simple';
import { string } from 'zod';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface DeleteDirectoryModalProps {
  showAlert: (message: string, success: boolean) => void;
  handlePopUpClose: () => void;
  open: boolean;
  subTitle?: string;
  title: string;
  idToDelete: string;
  successMessage?: string;
}

export const DeleteDirectoryModal: FC<DeleteDirectoryModalProps> = ({
  handlePopUpClose,
  showAlert,
  open,
  subTitle,
  title,
  idToDelete,
  successMessage = 'Diretório Deletado com Sucesso',
}) => {
  const { loggedUser } = useLoggedUser();

  const [action, setAction] = useState<string | null>(null);
  const [decisionModalOpen, setDecisionModalOpen] = useState<boolean>(false);

  const deleteDirectoryRequest = async () => {
    try {
      const filesInDirectory = await ListContentFilesRequest({
        userInput: '',
        loggedUserId: loggedUser?.id ?? '',
        directoryId: idToDelete,
      });
      if (filesInDirectory.files.length > 0) {
        setDecisionModalOpen(true);
      }

      await DeleteDirectoryRequest({
        id: idToDelete,
        loggedUserId: loggedUser?.id ?? '',
      });
      showAlert(successMessage, true);
      handlePopUpClose();
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        const errors = ValidationsError(axiosError, 'Usuario ou Diretório');
        if (errors) {
          showAlert(errors, false);
        }
      }
    }
  };

  const handleUserAction = async (userAction: string) => {
    setAction(userAction);
    setDecisionModalOpen(false);
    if (userAction === 'delete') {
      await DeleteDirectoryRequest({
        id: idToDelete,
        loggedUserId: loggedUser?.id ?? '',
      });
      showAlert(successMessage, true);
    } else if (userAction === 'move') {
      console.log('move');
      // await MoveDirectoryFilesRequest({
      //   id: idToDelete,
      //   loggedUserId: loggedUser?.id ?? '',
      // });
      showAlert('Arquivos movidos com sucesso', true);
    }
    handlePopUpClose();
  };

  return (
    <>
      <SimpleConfimationModal
        onClose={handlePopUpClose}
        open={open}
        subTitle={subTitle ?? ''}
        title={title}
        onSuccess={deleteDirectoryRequest}
      />
      <Dialog
        open={decisionModalOpen}
        onClose={() => setDecisionModalOpen(false)}
      >
        <DialogTitle>O diretório contém arquivos</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deseja deletar os arquivos ou movê-los?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleUserAction('delete')} color="primary">
            Deletar Arquivos
          </Button>
          <Button
            onClick={() => handleUserAction('move')}
            color="primary"
            autoFocus
          >
            Mover Arquivos
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
