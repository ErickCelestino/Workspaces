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
import { styled } from '@mui/system';
import { FileWithProgress } from '@workspaces/domain';

interface ProgressFilesListProps {
  filesList: FileWithProgress[];
  handleDelete: (fileName: string) => void;
  title?: string;
  progress: number;
}

const ScrollBox = styled(Box)({
  maxHeight: '11rem',
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    width: '12px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#888',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#555',
  },
});

export const ProgressFilesList: FC<ProgressFilesListProps> = ({
  filesList,
  handleDelete,
  title = 'Arquivos Selecionados:',
  progress,
}) => {
  return (
    <Box maxHeight="80%" mt={2}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1, ml: 1 }}>
          <LinearProgress
            variant="determinate"
            value={progress == Infinity ? 0 : progress}
          />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            progress == Infinity ? 0 : progress
          )}%`}</Typography>
        </Box>
      </Box>
      <Typography marginLeft="1rem" variant="h6">
        {title}
      </Typography>
      <ScrollBox>
        <List>
          {filesList.map(({ file }) => (
            <ListItem key={file.name}>
              <ListItemText
                sx={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  textWrap: 'nowrap',
                }}
                primary={file.name}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => handleDelete(file.name)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </ScrollBox>
    </Box>
  );
};
