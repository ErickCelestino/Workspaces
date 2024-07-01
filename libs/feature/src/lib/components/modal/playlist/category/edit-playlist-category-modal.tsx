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
import { useLoggedUser } from '../../../../contexts';
import { FC, useCallback, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { EditPlaylistCategoryBodyDto, ErrorResponse } from '@workspaces/domain';
import {
  EditPlaylistCategorySchema,
  ValidationsError,
} from '../../../../shared';
import { useForm } from 'react-hook-form';
import {
  EditPlaylistCategoryRequest,
  FindPlaylistCategoryByIdRequest,
} from '../../../../services';
import axios, { AxiosError } from 'axios';
import { FormButton } from '../../../form';

interface EditPlaylistCategoryModalProps {
  open: boolean;
  handlePopUpClose: () => void;
  showAlert: (message: string, success: boolean) => void;
  title: string;
  selectedId: string;
}

export const EditPlaylistCategoryModal: FC<EditPlaylistCategoryModalProps> = ({
  open,
  handlePopUpClose,
  showAlert,
  title,
  selectedId,
}) => {
  const theme = useTheme();
  const { loggedUser } = useLoggedUser();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

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

  const getData = useCallback(async () => {
    try {
      const result = await FindPlaylistCategoryByIdRequest({
        loggedUserId: loggedUser?.id ?? '',
        id: selectedId,
      });
      reset({
        id: result.id,
        name: result.name,
        description: result.description,
      });
      setDataLoaded(true);
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        const errors = ValidationsError(axiosError, 'Usuario ou Categoria');
        if (errors) {
          showAlert(errors, false);
        }
      }
    }
  }, [loggedUser?.id, selectedId, reset, showAlert]);

  useEffect(() => {
    if (open && selectedId && !dataLoaded) {
      getData();
    }
  }, [open, selectedId, getData, dataLoaded]);

  useEffect(() => {
    if (!open) {
      setDataLoaded(false);
    }
  }, [open]);

  const editCategory = async (data: EditPlaylistCategoryBodyDto) => {
    try {
      setLoading(true);
      setSuccess(false);
      const result = await EditPlaylistCategoryRequest({
        body: {
          name: data.name,
          description: data.description,
        },
        id: data.id,
        loggedUserId: loggedUser?.id ?? '',
      });
      setLoading(false);
      setSuccess(true);
      handlePopUpClose();
      return result;
    } catch (error) {
      setLoading(false);
      setSuccess(false);
      console.error(error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        const errors = ValidationsError(axiosError, 'Usuario ou Categoria');
        if (errors) {
          showAlert(errors, false);
        }
      }
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
            height: theme.spacing(67),
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
            onSubmit={handleSubmit(editCategory)}
          >
            <TextField
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true, required: true }}
              disabled={true}
              error={!!errors.id}
              helperText={errors.id?.message}
              id="id"
              label="id"
              {...register('id')}
              autoComplete="id"
            />

            <TextField
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true, required: true }}
              error={!!errors.name}
              helperText={errors.name?.message}
              id="name"
              label="name"
              {...register('name')}
              defaultValue=""
              autoComplete="name"
            />

            <TextField
              margin="normal"
              fullWidth
              multiline
              rows={4}
              InputLabelProps={{ shrink: true, required: true }}
              error={!!errors.description}
              helperText={errors.description?.message}
              id="description"
              label="description"
              {...register('description')}
              autoComplete="description"
            />

            <FormButton
              loading={loading}
              success={success}
              buttonTitle="Editar Categoria"
            />
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};
