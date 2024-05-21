import { zodResolver } from '@hookform/resolvers/zod';
import { Box, TextField, useTheme } from '@mui/material';
import { EditUserDto, ErrorResponse } from '@workspaces/domain';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { EditUserSchema, EntityNotExist } from '../../../shared';
import {
  EditUserRequest,
  FindUserRequest,
  getItemLocalStorage,
} from '../../../services';
import { FormButton } from '../form-button.component';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

interface FormEditUserProps {
  nameLabel: string;
  birthDateLabel: string;
  showAlert?: (message: string) => void;
}

export const FormEditUser: FC<FormEditUserProps> = ({
  nameLabel,
  birthDateLabel,
  showAlert,
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

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
    const getUserData = async () => {
      const getUserId = getItemLocalStorage('eu');
      const result = await FindUserRequest(getUserId);
      const formattedBirthDate = result.birthDate
        ? new Date(result.birthDate).toISOString().split('T')[0]
        : new Date();
      reset({
        id: result.userId,
        name: result.name,
        birthDate: formattedBirthDate as Date,
      });
    };
    getUserData();
  }, [reset]);

  const editUser = async (request: EditUserDto) => {
    try {
      const getUserId = getItemLocalStorage('eu');
      request.id = getUserId;
      const result = await EditUserRequest(request);
      console.log(result);
      return result;
    } catch (error) {
      console.error(error);
      console.error((error as { message: string }).message);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response?.data.error?.name === 'EntityNotExists') {
          const message = EntityNotExist(request.id, 'PT-BR');
          showAlert?.(message);
        }
      }
      setLoading(false);
    }
  };

  const handleUserData = async (data: EditUserDto) => {
    setSuccess(false);
    setLoading(true);
    await editUser(data);
    setSuccess(true);
    setLoading(false);
    navigate('/list-user');
  };

  return (
    <Box width="80%" component="form" onSubmit={handleSubmit(handleUserData)}>
      <TextField
        sx={{
          width: theme.spacing(40),
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
      <FormButton
        buttonTitle={loading ? 'Salvando...' : 'Salvar Alteração'}
        loading={loading}
        success={success}
      />
    </Box>
  );
};
