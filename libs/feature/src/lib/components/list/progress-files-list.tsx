import {
  Box,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
  makeStyles,
  useTheme,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { FC } from 'react';
import { FileWithProgress } from '@workspaces/domain';

interface ProgressFilesListProps {
  filesList: FileWithProgress[];
  handleDelete: (fileName: string) => void;
  title?: string;
}

export const ProgressFilesList: FC<ProgressFilesListProps> = ({
  filesList,
  handleDelete,
  title = 'Arquivos Selecionados:',
}) => {
  const theme = useTheme();
  return (
    <Box maxHeight="80%" mt={2}>
      <Typography marginLeft="1rem" variant="h6">
        {title}
      </Typography>
      <Box maxHeight={theme.spacing(45)} overflow="auto">
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
    </Box>
  );
};
