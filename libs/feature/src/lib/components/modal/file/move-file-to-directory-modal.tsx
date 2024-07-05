import {
  Box,
  Button,
  Divider,
  Fade,
  IconButton,
  MenuItem,
  Modal,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FC, useState } from 'react';
import { ErrorResponse, ListDirectoryNameDto } from '@workspaces/domain';
import { MoveFileToDirectoryRequest } from '../../../services';
import axios, { AxiosError } from 'axios';
import { ValidationsError } from '../../../shared';

interface MoveFileToDirectoryModalProps {
  open: boolean;
  onClose: () => void;
  showErrorAlert: (message: string) => void;
  idToMove: string;
  loggedUserId: string;
  title: string;
  buttonTitle: string;
  fieldLabel?: string;
}

export const MoveFileToDirectoryModal: FC<MoveFileToDirectoryModalProps> = ({
  open,
  onClose,
  showErrorAlert,
  idToMove,
  loggedUserId,
  title,
  buttonTitle,
  fieldLabel = 'Diretório',
}) => {
  const [directoryList, setDirectoryList] = useState<ListDirectoryNameDto[]>([
    {
      id: '2',
      name: 'teste',
    },
  ]);
  // Get Directory List Implementation

  const [selectedDirectoryId, setSelectedDirectoryId] = useState<string>('');

  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMoveFileData = async () => {
    try {
      await MoveFileToDirectoryRequest({
        idToMove,
        idToMoveDirectory: selectedDirectoryId,
        loggedUserId,
      });
      onClose();
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        const errors = ValidationsError(axiosError, 'arquivo ou diretório');
        if (errors) {
          showErrorAlert(errors);
        }
      }
    }
  };

  const handleChangeMoveFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDirectoryId(event.target.value);
  };

  return (
    <Modal open={open} onClose={onClose} closeAfterTransition>
      <Fade in={open}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            height: theme.spacing(35),
            width: smDown ? '95%' : theme.spacing(50),
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              alignItems: 'center',
              height: '100%',
            }}
            component="form"
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
                p: 2,
                borderRadius: 1,
              }}
            >
              <Typography
                marginRight={theme.spacing(10)}
                noWrap
                textOverflow="ellipsis"
                overflow="hidden"
                variant="h5"
              >
                <strong>{title}</strong>
              </Typography>
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '80%',
                width: '100%',
              }}
            >
              <TextField
                fullWidth
                select
                label={fieldLabel}
                value={selectedDirectoryId}
                id="id"
                onChange={handleChangeMoveFile}
              >
                {directoryList.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box
              sx={{
                marginTop: 'auto',
              }}
            >
              <Button onClick={handleMoveFileData} variant="contained">
                {buttonTitle}
              </Button>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};
