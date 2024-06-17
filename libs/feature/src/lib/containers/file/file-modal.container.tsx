import { useState } from 'react';
import { useFileModal } from '../../contexts';
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

  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const mdDown = useMediaQuery(theme.breakpoints.down('md'));

  const handleUpload = () => {
    setUploading(true);
    handleClose();
    //Implemente aqui o upload
  };

  const handleFileUpload = () => {};

  const handleFileToDelete = (fileToRemove: string) => {};

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
    </>
  );
};
