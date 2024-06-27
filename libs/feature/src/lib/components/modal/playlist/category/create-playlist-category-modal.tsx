import {
  Box,
  Modal,
  Fade,
  useTheme,
  useMediaQuery,
  Typography,
  IconButton,
  Divider,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  CreatePlaylistCategoryBodyDto,
  CreatePlaylistCategoryDto,
  ErrorResponse,
} from '@workspaces/domain';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreatePlaylistCategorySchema,
  ValidationsError,
} from '../../../../shared';
import { FormButton } from '../../../form';
import { useLoggedUser } from 'libs/feature/src/lib/contexts';
import { CreatePlaylistCategoryRequest } from 'libs/feature/src/lib/services';
import axios, { AxiosError } from 'axios';

interface CreatePlaylistCategoryModalProps {
  open: boolean;
  title: string;
  handlePopUpClose: () => void;
  showAlert: (message: string, success: boolean) => void;
  nameLabel?: string;
  descriptionLabel?: string;
  successMessage?: string;
}

export const CreatePlaylistCategoryModal: FC<
  CreatePlaylistCategoryModalProps
> = ({
  open,
  title,
  handlePopUpClose,
  showAlert,
  nameLabel = 'Nome',
  descriptionLabel = 'Descrição',
  successMessage = 'Categoria registrada com sucesso',
}) => {
  const theme = useTheme();
  const { loggedUser } = useLoggedUser();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<CreatePlaylistCategoryBodyDto>({
    mode: 'all',
    criteriaMode: 'all',
    resolver: zodResolver(CreatePlaylistCategorySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const createCategory = async (input: CreatePlaylistCategoryDto) => {
    try {
      const result = await CreatePlaylistCategoryRequest(input);
      return result;
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        const errors = ValidationsError(axiosError, 'Categoria ou Playlist');
        if (errors) {
          showAlert(errors, false);
        }
      }
    }
  };

  const handleCategoryData = async (data: CreatePlaylistCategoryBodyDto) => {
    setLoading(true);
    setSuccess(false);
    const result = await createCategory({
      body: data,
      loggedUserId: loggedUser?.id ?? '',
    });
    if (result) {
      setLoading(false);
      setSuccess(true);
      setSuccess(false);
      reset({
        name: '',
        description: '',
      });
      showAlert(successMessage, true);
      handlePopUpClose();
    }
  };

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
          </Box>
          <Divider />
          <Box
            sx={{ mt: 2 }}
            component="form"
            onSubmit={handleSubmit(handleCategoryData)}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              error={!!errors.name}
              helperText={errors.name?.message}
              id="name"
              disabled={loading}
              label={nameLabel}
              autoComplete="name"
              autoFocus
              {...register('name')}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              error={!!errors.description}
              helperText={errors.description?.message}
              id="description"
              disabled={loading}
              label={descriptionLabel}
              autoComplete="description"
              multiline
              rows={4}
              {...register('description')}
            />

            <FormButton
              buttonTitle="Registrar"
              loading={loading}
              success={success}
            />
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};