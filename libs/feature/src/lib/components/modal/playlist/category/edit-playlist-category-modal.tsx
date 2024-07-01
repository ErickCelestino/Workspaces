import {
  Box,
  Divider,
  Fade,
  IconButton,
  Modal,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useLoggedUser } from 'libs/feature/src/lib/contexts';
import { FC } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { EditPlaylistCategoryBodyDto } from '@workspaces/domain';
import { EditPlaylistCategorySchema } from 'libs/feature/src/lib/shared';
import { useForm } from 'react-hook-form';

interface EditPlaylistCategoryModalProps {
  open: boolean;
  handlePopUpClose: () => void;
  showAlert: (message: string, success: boolean) => void;
  title: string;
}

export const EditPlaylistCategoryModal: FC<EditPlaylistCategoryModalProps> = ({
  open,
  handlePopUpClose,
  showAlert,
  title,
}) => {
  const theme = useTheme();
  const { loggedUser } = useLoggedUser();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<EditPlaylistCategoryBodyDto>({
    mode: 'all',
    criteriaMode: 'all',
    resolver: zodResolver(EditPlaylistCategorySchema),
    defaultValues: {
      id: '',
      name: '',
      description: '',
    },
  });

  return (
    <Modal open={open} onClose={handlePopUpClose} closeAfterTransition>
      <Fade in={open}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            height: theme.spacing(63),
            width: smDown ? '90%' : theme.spacing(80),
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
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
              noWrap
              textOverflow="ellipsis"
              overflow="hidden"
              variant="h5"
            >
              <strong>{title}</strong>
            </Typography>
            <IconButton onClick={handlePopUpClose}>
              <CloseIcon />
            </IconButton>
            <Box sx={{ mt: 2 }} component="form">
              <TextField />
            </Box>
          </Box>
          <Divider />
        </Box>
      </Fade>
    </Modal>
  );
};
