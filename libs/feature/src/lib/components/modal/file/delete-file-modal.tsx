import { FC } from 'react';
import axios, { AxiosError } from 'axios';
import { DeleteContentFileByIdDto, ErrorResponse } from '@workspaces/domain';
import { DeleteContentFileByIdRequest } from '../../../services';
import {
  EntityNotEmpty,
  EntityNotExist,
  ConnectionError,
} from '../../../shared';
import { SimpleConfimationModal } from '../simple';

interface DeleteFileModalProps {
  showErrorAlert: (message: string) => void;
  onClose: () => void;
  directoryId: string;
  idToDelete: string;
  loggedUserId: string;
  open: boolean;
}

export const DeleteFileModal: FC<DeleteFileModalProps> = ({
  showErrorAlert,
  onClose,
  directoryId,
  idToDelete,
  loggedUserId,
  open,
}) => {
  const deleteFile = async () => {
    try {
      const dto: DeleteContentFileByIdDto = {
        directoryId,
        loggedUserId,
        idToDelete,
      };
      await DeleteContentFileByIdRequest(dto);
      onClose();
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
    <SimpleConfimationModal
      open={open}
      onSuccess={deleteFile}
      onClose={onClose}
      title="Deseja deletar o arquivo?"
      subTitle="Por favor, selecione alguma das alternativas"
    />
  );
};
