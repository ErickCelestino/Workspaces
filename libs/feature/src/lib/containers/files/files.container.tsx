import { Box, Button, Card, CardActions, useTheme } from '@mui/material';
import { LayoutBase } from '../../layout';
import { FilesUpload } from '../../components';
import { CreateContenVideoRequest, getItemLocalStorage } from '../../services';
import { useLoggedUser } from '../../contexts';
import { useCallback, useState } from 'react';
import { FileWithProgress } from '@workspaces/domain';

export const FilesContainer = () => {
  const theme = useTheme();
  const { loggedUser } = useLoggedUser();
  const [filesToUpload, setFilesToUpload] = useState<FileWithProgress[]>([]);

  const handleFileUpload = (files: FileWithProgress[]) => {
    setFilesToUpload((prevFile) => [...prevFile, ...files]);
    console.log('Files uploaded:', files);
  };

  const uploadFiles = useCallback(async () => {
    try {
      const loggedUserId = loggedUser?.id ?? '';
      const directoryId = getItemLocalStorage('di');
      await CreateContenVideoRequest(filesToUpload, {
        directoryId: directoryId,
        loggedUserId,
      });
      setFilesToUpload([]);
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
            height: theme.spacing(90),
            width: theme.spacing(100),
          }}
        >
          <FilesUpload
            onFileUpload={handleFileUpload}
            width={theme.spacing(100)}
            height={theme.spacing(30)}
          />
          <CardActions>
            <Button>Enviar</Button>
          </CardActions>
        </Card>
      </Box>
    </LayoutBase>
  );
};
