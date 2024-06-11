import {
  Box,
  CircularProgress,
  IconButton,
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
  updateProgress: (fileIndex: number, progress: number) => void;
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
// No componente ProgressFilesList
export const ProgressFilesList: FC<ProgressFilesListProps> = ({
  filesList,
  handleDelete,
  title = 'Arquivos Selecionados:',
  updateProgress,
}) => {
  return (
    <Box maxHeight="80%" mt={2}>
      <Typography marginLeft="1rem" variant="h6">
        {title}
      </Typography>
      <ScrollBox>
        <List>
          {filesList.map(({ file, progress }, index) => (
            <ListItem key={file.name}>
              <ListItemText
                sx={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  textWrap: 'nowrap',
                }}
                primary={file.name}
              />
              <Box display="flex" width="50%" justifyContent="end" mx={2}>
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                  <CircularProgress variant="determinate" value={progress} />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      variant="caption"
                      component="div"
                      color="text.secondary"
                    >
                      {`${Math.round(progress)}%`}
                    </Typography>
                  </Box>
                </Box>
              </Box>
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
