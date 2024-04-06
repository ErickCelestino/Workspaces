import { Box, TextField } from '@mui/material';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateAuthSchema } from '../../shared';
import { FormButton } from '../form-button';
import {
  AuthConfirmProps,
  CreateAuthDto,
  ErrorResponse,
} from '@workspaces/domain';
import { CreateAuth, getUserIdLocalStorage } from '../../services';
import axios, { AxiosError } from 'axios';

interface ConfirmPassword {
  email: string;
  password: string;
  confirmPassword: string;
}

export const FormAuthConfirm: FC<AuthConfirmProps> = ({
  emailLabel = 'Digite seu e-mail',
  passwordLabel = 'Digite sua senha',
  confirmPasswordLabel = 'Digite sua senha novamente',
  buttonTitle = 'Finalizar Cadastro',
  showAlert,
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ConfirmPassword>({
    mode: 'all',
    criteriaMode: 'all',
    resolver: zodResolver(CreateAuthSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const createAuth = async (request: CreateAuthDto) => {
    try {
      await CreateAuth(request);
    } catch (error) {
      console.error((error as { message: string }).message);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        console.log(axiosError.response?.data.error);
        showAlert?.(`${axiosError.response?.data.error.message}`);
      }
      setLoading(false);
    }
  };

  const handleData = async (data: ConfirmPassword) => {
    setSuccess(false);
    setLoading(true);
    const userId = getUserIdLocalStorage();

    const request: CreateAuthDto = {
      email: data.email,
      password: data.password,
      userId: userId,
    };
    console.log(request);
    await createAuth(request);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleData)}>
      <TextField
        margin="normal"
        required
        fullWidth
        error={!!errors.email}
        helperText={errors.email?.message}
        id="email"
        disabled={loading}
        label={emailLabel}
        autoComplete="email"
        autoFocus
        {...register('email')}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        error={!!errors.password}
        helperText={errors.password?.message}
        id="password"
        disabled={loading}
        label={passwordLabel}
        autoComplete="password"
        {...register('password')}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
        id="confirmPassword"
        disabled={loading}
        label={confirmPasswordLabel}
        autoComplete="confirmPassword"
        {...register('confirmPassword')}
      />
      <FormButton
        success={success}
        loading={loading}
        buttonTitle={buttonTitle}
      />
    </Box>
  );
};
