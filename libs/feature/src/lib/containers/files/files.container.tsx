import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { LayoutBase } from '../../layout';
import { FC, useState } from 'react';

export const FilesContainer = () => {
  const theme = useTheme();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setSelectedFiles((prevFiles) => [...prevFiles, ...filesArray]);
    }
  };

  const handleDeleteFile = (fileName: string) => {
    const updatedFiles = selectedFiles.filter((file) => file.name !== fileName);
    setSelectedFiles(updatedFiles);
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
          <CardContent>
            <Box>
              <Button
                variant="contained"
                component="label"
                startIcon={<CloudUploadIcon />}
              >
                Upload File
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
              {selectedFiles.length > 0 && (
                <Box mt={2}>
                  <Typography variant="h6">Aquivos Selecionados:</Typography>
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
          </CardContent>
        </Card>
      </Box>
    </LayoutBase>
  );
};
