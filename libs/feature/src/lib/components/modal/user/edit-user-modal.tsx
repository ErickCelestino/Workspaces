import { FC, useCallback, useEffect, useState } from 'react';
import { useLoggedUser } from '../../../contexts';
import {
  EditUserDto,
  ErrorResponse,
  FindUserByIdDto,
} from '@workspaces/domain';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EditUserSchema, ValidationsError } from '../../../shared';
import { EditUserRequest, FindUserRequest } from '../../../services';
import axios, { AxiosError } from 'axios';
import { SimpleFormModal } from '../simple';
import {
  Box,
  MenuItem,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { FormButton } from '../../form';

interface EditUserModalProps {
  open: boolean;
  title: string;
  idToEdit: string;
  handlePopUpClose: () => void;
  showAlert: (message: string, success: boolean) => void;
  nameLabel?: string;
  successMessage?: string;
  statusLabel?: string;
  birthDateLabel?: string;
}

export const EditUserModal: FC<EditUserModalProps> = ({
  handlePopUpClose,
  showAlert,
  title,
  open,
  idToEdit,
  nameLabel = 'Nome',
  statusLabel = 'Status',
  birthDateLabel = 'Data de Nascimento',
  successMessage = 'Usuário Editado com Sucesso',
}) => {
  const { loggedUser } = useLoggedUser();
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const mdDown = useMediaQuery(theme.breakpoints.down('md'));
  const [dataLoaded, setDataLoaded] = useState(false);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<EditUserDto>({
    mode: 'all',
    criteriaMode: 'all',
    resolver: zodResolver(EditUserSchema),
    defaultValues: {
      name: '',
      id: '',
      birthDate: new Date(),
    },
  });

  useEffect(() => {
    if (!open) {
      setDataLoaded(false);
    }
  }, [open]);

  const getUserData = useCallback(
    async (input: FindUserByIdDto) => {
      try {
        const result = await FindUserRequest(input);
        const formattedBirthDate = result.birthDate
          ? new Date(result.birthDate).toISOString().split('T')[0]
          : new Date();
        reset({
          id: result.userId,
          name: result.name,
          birthDate: formattedBirthDate as Date,
        });

        setStatus(result.status);
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ErrorResponse>;
          const errors = ValidationsError(axiosError, 'Usuario');
          if (errors) {
            showAlert(errors, false);
          }
        }
      }
    },
    [reset, ValidationsError]
  );

  useEffect(() => {
    if (open && idToEdit && !dataLoaded) {
      const loggedUserId = loggedUser?.id ?? '';

      getUserData({
        id: idToEdit,
        loggedUserId: loggedUserId,
      });
    }
  }, [loggedUser, idToEdit, dataLoaded, open, getUserData]);

  const editUser = async (request: EditUserDto) => {
    try {
      request.id = idToEdit;
      const result = await EditUserRequest({
        ...request,
        id: idToEdit,
      });
      return result;
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        const errors = ValidationsError(axiosError, 'Usuario');
        if (errors) {
          showAlert(errors, false);
        }
      }
      setLoading(false);
    }
  };

  const handleUserData = async (data: EditUserDto) => {
    setSuccess(false);
    setLoading(true);
    const editedUser = await editUser(data);
    if (editedUser) {
      setSuccess(true);
      setLoading(false);
      showAlert(successMessage, true);
      handlePopUpClose();
      setSuccess(false);
    }
  };

  const statusList = ['ACTIVE', 'INACTIVE'];

  const handleChangeStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(event.target.value);
  };

  return (
    <SimpleFormModal
      height={smDown ? theme.spacing(65) : theme.spacing(62)}
      width={smDown ? '90%' : theme.spacing(100)}
      open={open}
      handlePopUpClose={handlePopUpClose}
      title={title}
    >
      <Box component="form" onSubmit={handleSubmit(handleUserData)}>
        <Box display="flex" justifyContent="space-between">
          <TextField
            sx={{
              width: smDown
                ? '100%'
                : mdDown
                ? theme.spacing(45)
                : theme.spacing(42),
            }}
            margin="normal"
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
            sx={{
              width: smDown
                ? '100%'
                : mdDown
                ? theme.spacing(45)
                : theme.spacing(30),
            }}
            select
            value={status}
            margin="normal"
            error={!!errors.status}
            helperText={errors.status?.message}
            id="status"
            label={statusLabel}
            {...register('status', { onChange: handleChangeStatus })}
          >
            {statusList.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <TextField
          margin="normal"
          InputLabelProps={{ shrink: true, required: true }}
          disabled={loading}
          fullWidth
          error={!!errors.name}
          helperText={errors.name?.message}
          id="name"
          label={nameLabel}
          {...register('name')}
          autoComplete="name"
        />
        <TextField
          margin="normal"
          type="date"
          disabled={loading}
          error={!!errors.birthDate}
          helperText={errors.birthDate?.message}
          InputLabelProps={{ shrink: true, required: true }}
          label={birthDateLabel}
          id="birthDate"
          fullWidth
          {...register('birthDate')}
        />
        <Box
          sx={{
            marginTop: mdDown ? '1rem' : '2rem',
          }}
        >
          <FormButton
            buttonTitle={loading ? 'Salvando...' : 'Salvar Alteração'}
            loading={loading}
            success={success}
          />
        </Box>
      </Box>
    </SimpleFormModal>
  );
};
