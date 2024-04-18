import { Box, TextField } from '@mui/material';
import { FormButton } from '../form-button';
import { FC, useState } from 'react';
import { CreateUserRequest, setUserIdLocalStorage } from '../../services';
import {
  CreateUserDto,
  ErrorResponse,
  FormCreateUserProps,
} from '@workspaces/domain';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CreateUserSchema, EntityExist } from '../../shared';
import axios, { AxiosError } from 'axios';

export const FormCreateUser: FC<FormCreateUserProps> = ({
  buttonTitle = 'Cadastrar Usuario',
  nameLabel = 'Digite seu Nome',
  nicknameLabel = 'Digite seu Nickname',
  birthDateLabel = 'Digite sua data de Nascimento',
  onData,
  showAlert,
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CreateUserDto>({
    mode: 'all',
    criteriaMode: 'all',
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      name: '',
      nickname: '',
      birthDate: new Date(),
    },
  });

  const createUser = async (request: CreateUserDto) => {
    try {
      const result = await CreateUserRequest(request);
      return result;
    } catch (error) {
      console.error((error as { message: string }).message);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response?.data.error.name === 'EntityAlreadyExists') {
          const message = EntityExist(request.nickname, 'nickname');
          showAlert?.(message);
        }
      }
      setLoading(false);
    }
  };

  const handleData = async (data: CreateUserDto) => {
    setSuccess(false);
    setLoading(true);
    const createdUserId = await createUser(data);
    console.log(createdUserId);
    if (createdUserId !== undefined) {
      setUserIdLocalStorage(createdUserId);
      onData?.(1);
    }
  };
  return (
    <Box component="form" onSubmit={handleSubmit(handleData)}>
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
        disabled={loading}
        fullWidth
        error={!!errors.nickname}
        helperText={errors.nickname?.message}
        id="nickname"
        label={nicknameLabel}
        {...register('nickname')}
        autoComplete="nickname"
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
        success={success}
        loading={loading}
        buttonTitle={buttonTitle}
      />
    </Box>
  );
};