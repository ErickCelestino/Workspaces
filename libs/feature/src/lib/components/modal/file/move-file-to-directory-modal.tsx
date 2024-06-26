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
import { ListDirectoryNameDto } from '@workspaces/domain';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DirectoryNameSchema } from '../../../shared';

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
      id: '1',
      name: 'teste',
    },
  ]);
  const [selectedDirectory, setSelectedDirectory] = useState<string>('');
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ListDirectoryNameDto>({
    mode: 'all',
    criteriaMode: 'all',
    resolver: zodResolver(DirectoryNameSchema),
    defaultValues: {
      name: '',
    },
  });
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMoveFileData = async (data: ListDirectoryNameDto) => {
    console.log(data);
    console.log(selectedDirectory);
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
            width: smDown ? '90%' : theme.spacing(50),
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
              <Divider />
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '80%',
                width: '100%',
              }}
              component="form"
              onSubmit={handleSubmit(handleMoveFileData)}
            >
              <TextField
                fullWidth
                select
                label={fieldLabel}
                value={selectedDirectory}
                onChange={(e) => setSelectedDirectory(e.target.value)}
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
              <Button type="submit" variant="contained">
                {buttonTitle}
              </Button>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};
