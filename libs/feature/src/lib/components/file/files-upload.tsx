import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Button,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  LinearProgress,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { FileWithProgress } from '@workspaces/domain';

interface FilesUploadProps {
  height: string;
  width: string;
  onFileUpload: (files: FileWithProgress[]) => void;
}

export const FilesUpload: React.FC<FilesUploadProps> = ({
  height,
  width,
  onFileUpload,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<FileWithProgress[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const filesWithProgress = acceptedFiles.map((file) => ({
        file,
        progress: 0,
      }));
      setSelectedFiles((prevFiles) => [...prevFiles, ...filesWithProgress]);
      onFileUpload(filesWithProgress);
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleDeleteFile = (fileName: string) => {
    const updatedFiles = selectedFiles.filter(
      (file) => file.file.name !== fileName
    );
    setSelectedFiles(updatedFiles);
  };

  return (
    <Box>
      <Paper
        {...getRootProps()}
        sx={{
          p: 2,
          textAlign: 'center',
          color: 'text.secondary',
          border: '2px dashed grey',
          cursor: 'pointer',
          mb: 2,
          height: height,
          width: width,
        }}
      >
        <input {...getInputProps()} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              maxWidth: '60%',
            }}
          >
            <Typography>
              {isDragActive
                ? 'Solte os arquivos aqui ...'
                : 'Arraste e solte arquivos aqui, ou clique para selecionar arquivos'}
            </Typography>

            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
              sx={{
                mt: 2,
              }}
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              Upload File
              <input
                type="file"
                hidden
                multiple
                onChange={(event) => {
                  if (event.target.files) {
                    const filesArray = Array.from(event.target.files);
                    const filesWithProgress = filesArray.map((file) => ({
                      file,
                      progress: 0,
                    }));
                    setSelectedFiles((prevFiles) => [
                      ...prevFiles,
                      ...filesWithProgress,
                    ]);
                    onFileUpload(filesWithProgress);
                  }
                }}
              />
            </Button>
          </Box>
        </Box>
      </Paper>
      {selectedFiles.length > 0 && (
        <Box mt={2}>
          <Typography marginLeft="1rem" variant="h6">
            Arquivos Selecionados:
          </Typography>
          <List>
            {selectedFiles.map(({ file, progress }) => (
              <ListItem key={file.name}>
                <ListItemText primary={file.name} />
                <Box width="100%" mx={2}>
                  <LinearProgress variant="determinate" value={progress} />
                </Box>
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => handleDeleteFile(file.name)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};
