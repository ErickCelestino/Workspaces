import {
  Box,
  Button,
  Card,
  CardActions,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { LayoutBase } from '../../layout';
import { FilesUpload } from '../../components';
import {
  CreateContenVideoRequest,
  getItemLocalStorage,
  removeItemLocalStorage,
} from '../../services';
import { useLoggedUser } from '../../contexts';
import { useCallback, useState } from 'react';
import { FileWithProgress } from '@workspaces/domain';

export const FilesContainer = () => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const mdDown = useMediaQuery(theme.breakpoints.down('md'));
  const { loggedUser } = useLoggedUser();
  const [filesToUpload, setFilesToUpload] = useState<FileWithProgress[]>([]);

  const handleFileUpload = (files: FileWithProgress[]) => {
    setFilesToUpload((prevFiles) => {
      const updatedFiles = prevFiles.concat(files);
      return updatedFiles;
    });
  };

  const updateProgress = useCallback((fileIndex: number, progress: number) => {
    setFilesToUpload((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles[fileIndex] = {
        ...newFiles[fileIndex],
        progress,
      };
      return newFiles;
    });
  }, []);

  const uploadFiles = useCallback(async () => {
    try {
      const loggedUserId = loggedUser?.id ?? '';
      const directoryId = getItemLocalStorage('di');

      const config = {
        directoryId: directoryId,
        loggedUserId,
      };

      await CreateContenVideoRequest(filesToUpload, config, updateProgress);
      setFilesToUpload([]);
      removeItemLocalStorage('files');
    } catch (err) {
      console.error(err);
    }
  }, [loggedUser, filesToUpload]);

  const handleUploadClick = () => {
    uploadFiles();
  };

  return (
    <LayoutBase title="Arquivos">
      <Box display="flex" justifyContent="center">
        <Card
          component="span"
          sx={{
            height: theme.spacing(65),
            width: smDown
              ? theme.spacing(45)
              : mdDown
              ? theme.spacing(65)
              : theme.spacing(100),
          }}
        >
          <FilesUpload
            updateProgress={updateProgress}
            onFileUpload={handleFileUpload}
            width={
              smDown
                ? theme.spacing(45)
                : mdDown
                ? theme.spacing(65)
                : theme.spacing(100)
            }
            height={theme.spacing(30)}
          />
          <CardActions disableSpacing>
            <Box sx={{ flexGrow: 1 }} />
            <Button onClick={handleUploadClick} variant="contained">
              Enviar
            </Button>
          </CardActions>
        </Card>
      </Box>
    </LayoutBase>
  );
};
