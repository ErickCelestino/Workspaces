import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Button, Typography, Paper } from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { FileWithProgress } from '@workspaces/domain';
import { ProgressFilesList } from '../list';
import { getItemLocalStorage, setItemLocalStorage } from '../../services';

interface FilesUploadProps {
  height: string;
  width: string;
  listUpdateFiles?: FileWithProgress[];
  onFileUpload: (files: FileWithProgress[]) => void;
}

export const FilesUpload: React.FC<FilesUploadProps> = ({
  height,
  width,
  listUpdateFiles,
  onFileUpload,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<FileWithProgress[]>([]);

  useEffect(() => {
    if (Object.keys(selectedFiles).length < 1) {
      const files = getItemLocalStorage('files');
      if (files) {
        const mappedFiles: FileWithProgress[] = JSON.parse(files);
        console.log(mappedFiles);
        setSelectedFiles([]);
        setSelectedFiles(mappedFiles);
      }
    }
  }, [selectedFiles]);

  const filterDuplicateFiles = useCallback(
    (newFiles: File[]) => {
      return newFiles.filter(
        (newFile) =>
          !selectedFiles.some(
            (selectedFile) => selectedFile.file.name === newFile.name
          )
      );
    },
    [selectedFiles]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const uniqueFiles = filterDuplicateFiles(acceptedFiles);
      const filesWithProgress = uniqueFiles.map((file) => ({
        file,
        progress: 0,
      }));
      const mappedFiles = JSON.stringify(
        filesWithProgress.map((item) => {
          return {
            file: {
              name: item.file?.name,
            },
            progress: item.progress,
          };
        })
      );

      setItemLocalStorage(mappedFiles, 'files');
      setSelectedFiles((prevFiles) => [...prevFiles, ...filesWithProgress]);
      onFileUpload(filesWithProgress);
    },
    [filterDuplicateFiles, onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleDeleteFile = (fileName: string) => {
    const fileList = getItemLocalStorage('files');
    const stringWithoutBrackets = fileList.slice(1, -1);
    const list = stringWithoutBrackets.split(',');

    const updatedFiles = selectedFiles.filter(
      (file) => file.file.name !== fileName
    );
    console.log(typeof fileList);
    console.log(list);
    console.log(fileList);
    // const mappedFiles = JSON.stringify(
    //   fileList.filter((item) => item.file.name !== fileName)
    // );

    //setItemLocalStorage(mappedFiles, 'files');
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
                    console.log('No onChange');
                    console.log(JSON.stringify(filesWithProgress));
                    // setItemLocalStorage(
                    //   JSON.stringify(filesWithProgress),
                    //   'files'
                    // );
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
