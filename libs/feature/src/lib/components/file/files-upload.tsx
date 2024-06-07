import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Button, Typography, Paper } from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { FileWithProgress } from '@workspaces/domain';
import { ProgressFilesList } from '../list';

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

  const filterDuplicateFiles = (newFiles: File[]) => {
    return newFiles.filter(
      (newFile) =>
        !selectedFiles.some(
          (selectedFile) => selectedFile.file.name === newFile.name
        )
    );
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const uniqueFiles = filterDuplicateFiles(acceptedFiles);
      const filesWithProgress = uniqueFiles.map((file) => ({
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
                    const uniqueFiles = filterDuplicateFiles(filesArray);
                    const filesWithProgress = uniqueFiles.map((file) => ({
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
        <ProgressFilesList
          filesList={selectedFiles}
          handleDelete={handleDeleteFile}
        />
      )}
    </Box>
  );
};
