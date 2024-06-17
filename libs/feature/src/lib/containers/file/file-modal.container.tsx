import { FC, useCallback, useState } from 'react';
import { useFileModal, useLoggedUser } from '../../contexts';
import {
  Box,
  Button,
  IconButton,
  Modal,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { FilesUpload } from '../../components';
import {
  ErrorResponse,
  FileConfigs,
  FileWithProgress,
} from '@workspaces/domain';
import { useSnackbarAlert } from '../../hooks';
import axios, { AxiosError } from 'axios';
import {
  ConnectionError,
  EntityNotAllowed,
  EntityNotCreated,
  EntityNotEmpty,
} from '../../shared';
import {
  CreateContenVideoRequest,
  getItemLocalStorage,
  removeItemLocalStorage,
} from '../../services';
import { ProgressFilePopUp } from '../../components/popup';

interface FileModalContainerProps {
  modalTitle?: string;
  sucessAlertMessage?: string;
  uploadTitleButton?: string;
}

export const FileModalContainer: FC<FileModalContainerProps> = ({
  modalTitle = 'Fazer Upload',
  sucessAlertMessage = 'Arquivos Salvos com sucesso',
  uploadTitleButton = 'Subir Arquivos',
}) => {
  const { open, handleClose } = useFileModal();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [filesToUpload, setFilesToUpload] = useState<FileWithProgress[]>([]);
  const { loggedUser } = useLoggedUser();
  const { showSnackbarAlert, SnackbarAlert } = useSnackbarAlert();
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const mdDown = useMediaQuery(theme.breakpoints.down('md'));

  const handleUpload = () => {
    setUploading(true);
    handleClose();
    uploadFiles();
  };

  const handleFileUpload = (files: FileWithProgress[]) => {
    setFilesToUpload((prevFiles) => {
      const newFiles = files.filter(
        (file) =>
          !prevFiles.some((prevFile) => prevFile.file.name === file.file.name)
      );
      const updatedFiles = [...prevFiles, ...newFiles];

      return updatedFiles;
    });
  };

  const handleFileToDelete = (fileToRemove: string) => {
    setFilesToUpload((prevFiles) => {
      const updatedFiles = prevFiles.filter(
        (file) => file.file.name !== fileToRemove
      );
      return updatedFiles;
    });
  };

  const updateProgress = useCallback((progress: number) => {
    setProgress(progress);
  }, []);

  const onFinish = async (
    data: FileConfigs,
    updateProgress: (progress: number) => void
  ) => {
    try {
      const result = await CreateContenVideoRequest(data, updateProgress);
      setFilesToUpload([]);
      removeItemLocalStorage('files');

      return result;
    } catch (error) {
      console.error(error);
      console.error((error as { message: string }).message);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        switch (axiosError.response?.data.error.name) {
          case 'EntityNotEmpty':
            showErrorAlert(EntityNotEmpty('Arquivos', 'PT-BR'));
            break;

          case 'EntityNotCreated':
            showErrorAlert(EntityNotCreated('Arquivos', 'PT-BR'));
            break;

          case 'FileNotAllowed':
            showErrorAlert(EntityNotAllowed('Arquivos', 'PT-BR'));
            break;

          default:
            showErrorAlert(ConnectionError('PT-BR'));
            break;
        }
      }
    }
  };

  const showErrorAlert = (message: string) => {
    showSnackbarAlert({
      message: message,
      severity: 'error',
    });
  };

  const onCloseProgressFile = () => {
    setUploading(false);
  };

  const uploadFiles = useCallback(async () => {
    const loggedUserId = loggedUser?.id ?? '';
    const directoryId = getItemLocalStorage('di');

    const result = await onFinish(
      {
        directoryId: directoryId,
        loggedUserId: loggedUserId,
        filesToUpload: filesToUpload,
      },
      updateProgress
    );
    if (result) {
      showSnackbarAlert({
        message: sucessAlertMessage,
        severity: 'success',
      });
    }
  }, [onFinish]);

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: smDown
              ? theme.spacing(45)
              : mdDown
              ? theme.spacing(65)
              : theme.spacing(100),
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">{modalTitle}</Typography>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Box>
          <Box mt={2}>
            <FilesUpload
              onFileDelete={handleFileToDelete}
              progress={progress}
              onFileUpload={handleFileUpload}
              width={
                smDown
                  ? theme.spacing(45)
                  : mdDown
                  ? theme.spacing(65)
                  : theme.spacing(92)
              }
              height={theme.spacing(28)}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'end',
            }}
            mt={2}
          >
            <Button onClick={handleUpload} variant="contained">
              {uploadTitleButton}
            </Button>
          </Box>
        </Box>
      </Modal>
      {uploading && (
        <ProgressFilePopUp
          handleClose={onCloseProgressFile}
          progress={progress}
        />
      )}
      {SnackbarAlert}
    </>
  );
};
