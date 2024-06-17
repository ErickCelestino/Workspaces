import { useCallback, useState } from 'react';
import { useFileModal, useLoggedUser } from '../../contexts';
import {
  Box,
  Button,
  IconButton,
  LinearProgress,
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

const progressStyle = {
  position: 'fixed' as 'fixed',
  bottom: 16,
  right: 16,
  width: 300,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
  display: 'flex',
  alignItems: 'center',
};

export const FileModalContainer = () => {
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
        message: 'Arquivos Salvos com sucesso',
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
            <Typography variant="h6">Upload File</Typography>
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
          <Box mt={2}>
            <Button onClick={handleUpload} variant="contained">
              Subir Arquivos
            </Button>
          </Box>
        </Box>
      </Modal>
      {uploading && (
        <Box sx={progressStyle}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ width: '100%' }}
          />
          <Box ml={2}>
            <Typography variant="body2">{progress}%</Typography>
          </Box>
        </Box>
      )}

      {SnackbarAlert}
    </>
  );
};
