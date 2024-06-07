import {
  Box,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { FC } from 'react';
import { FileWithProgress } from '@workspaces/domain';

interface ProgressFilesListProps {
  filesList: FileWithProgress[];
  handleDelete: (fileName: string) => void;
}

export const ProgressFilesList: FC<ProgressFilesListProps> = ({
  filesList,
  handleDelete,
}) => {
  return (
    <Box mt={2}>
      <Typography marginLeft="1rem" variant="h6">
        Arquivos Selecionados:
      </Typography>
      <List>
        {filesList.map(({ file, progress }) => (
          <ListItem key={file.name}>
            <ListItemText primary={file.name} />
            <Box width="100%" mx={2}>
              <LinearProgress variant="determinate" value={progress} />
            </Box>
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => handleDelete(file.name)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
