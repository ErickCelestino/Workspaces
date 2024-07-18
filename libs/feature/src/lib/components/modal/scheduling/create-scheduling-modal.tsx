import { Box, TextField, useMediaQuery, useTheme } from '@mui/material';
import { useLoggedUser } from '../../../contexts';
import { FC, useState } from 'react';
import { SimpleFormModal } from '../simple';
import { useForm } from 'react-hook-form';
import {
  CreateSchedulingBodyDto,
  CreateSchedulingDto,
  ErrorResponse,
} from '@workspaces/domain';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateSchedulingSchema, ValidationsError } from '../../../shared';
import axios, { AxiosError } from 'axios';

interface CreateSchedulingModalProps {
  open: boolean;
  title: string;
  handlePopUpClose: () => void;
  showAlert: (message: string, success: boolean) => void;
  nameLabel?: string;
  successMessage?: string;
}

export const CreateSchedulingModal: FC<CreateSchedulingModalProps> = ({
  handlePopUpClose,
  showAlert,
  title,
  open,
  nameLabel = 'Nome',
  successMessage = 'Agendamento Cadastrada com Sucesso',
}) => {
  const { loggedUser } = useLoggedUser();
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CreateSchedulingBodyDto>({
    mode: 'all',
    criteriaMode: 'all',
    resolver: zodResolver(CreateSchedulingSchema),
    defaultValues: {
      name: '',
      endTime: '',
      startTime: '',
      lopping: false,
      priority: 0,
    },
  });

  const createScheduling = async (input: CreateSchedulingDto) => {
    try {
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        const errors = ValidationsError(axiosError, 'Agendamento');
        if (errors) {
          showAlert(errors, false);
        }
      }
    }
  };

  const handleSchedulingData = async (data: CreateSchedulingBodyDto) => {
    setLoading(true);
    await createScheduling({
      body: data,
      loggedUserId: loggedUser?.id ?? '',
    });
  };

  return (
    <SimpleFormModal
      height={smDown ? theme.spacing(55) : theme.spacing(53)}
      width={smDown ? '90%' : theme.spacing(80)}
      open={open}
      handlePopUpClose={handlePopUpClose}
      title={title}
    >
      <Box
        sx={{ mt: 2 }}
        component="form"
        onSubmit={handleSubmit(handleSchedulingData)}
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
      </Box>
    </SimpleFormModal>
  );
};
