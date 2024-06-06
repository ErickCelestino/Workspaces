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
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

interface FilesUploadProps {
  onFileUpload: (files: File[]) => void;
  height: string;
  width: string;
}

export const FilesUpload: React.FC<FilesUploadProps> = ({
  onFileUpload,
  height,
  width,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setSelectedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
      onFileUpload([...selectedFiles, ...acceptedFiles]);
    },
    [selectedFiles, onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleDeleteFile = (fileName: string) => {
    const updatedFiles = selectedFiles.filter((file) => file.name !== fileName);
    setSelectedFiles(updatedFiles);
    onFileUpload(updatedFiles);
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
            {isDragActive ? (
              <Typography>Solte os arquivos aqui ...</Typography>
            ) : (
              <Typography>
                Arraste e solte arquivos aqui, ou clique para selecionar
                arquivos
              </Typography>
            )}
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
              sx={{
                mt: 2,
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
                    setSelectedFiles((prevFiles) => [
                      ...prevFiles,
                      ...filesArray,
                    ]);
                    onFileUpload([...selectedFiles, ...filesArray]);
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
            {selectedFiles.map((file) => (
              <ListItem key={file.name}>
                <ListItemText primary={file.name} />
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
