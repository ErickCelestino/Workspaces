import { Box, TextField } from '@mui/material';
import { FormButton } from '../form-button';
import { FC, useState } from 'react';
import { useSnackbarAlert } from '../../hooks';
import { CreateUserRequest, setUserIdLocalStorage } from '../../services';
import { CreateUserDto, FormCreateUserProps } from '@workspaces/domain';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CreateUserSchema } from '../../shared';

export const FormCreateUser: FC<FormCreateUserProps> = ({
  buttonTitle = 'Cadastrar Usuario',
  nameLabel = 'Digite seu Nome',
  nicknameLabel = 'Digite seu Nickname',
  birthDateLabel = 'Digite sua data de Nascimento',
  onData,
}) => {
  const { showSnackbarAlert, SnackbarAlert } = useSnackbarAlert();
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

  const createUser = async (data: CreateUserDto) => {
    try {
      const result = await CreateUserRequest(data);
      return result;
    } catch (error) {
      showSnackbarAlert({
        message: (error as { message: string }).message,
        severity: 'error',
      });
      setLoading(false);
    }
  };

  const handleData = async (data: CreateUserDto) => {
    setSuccess(false);
    setLoading(true);
    const createdUserId = await createUser?.(data);
    setUserIdLocalStorage(createdUserId);
    onData?.(1);
  };
  return (
    <>
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
          InputLabelProps={{ shrink: true }}
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
      {SnackbarAlert}
    </>
  );
};
