import {
  Avatar,
  Box,
  Checkbox,
  Container,
  FormControlLabel,
  Link,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { FormAuthCard, FormButton } from '../../components';
import { useAuth } from '../../hooks';
import { ValidateUserDto } from '@workspaces/domain';
import React, { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbarAlert } from '../../hooks';
import { useForm } from 'react-hook-form';
import { LoginSchema } from '../../shared';
import { zodResolver } from '@hookform/resolvers/zod';

interface LoginContainerProps {
  cardImage: string;
  logo: string;
  title?: string;
  passwordLabel?: string;
  emailLabel?: string;
  buttonTitle?: string;
  remenberTitle?: string;
  registerTitle?: string;
  registerHref?: string;
  children?: ReactNode;
}

export const LoginContainer: React.FC<LoginContainerProps> = ({
  cardImage = '',
  logo = '',
  title = 'Fazer Login',
  passwordLabel = 'Digite sua Senha',
  emailLabel = 'Digite seu Email',
  buttonTitle = 'Entrar',
  remenberTitle = 'Lembrar',
  registerTitle = 'Quer se cadastrar?',
  registerHref = '/register',
  children,
}) => {
  const auth = useAuth();
  const history = useNavigate();
  const theme = useTheme();
  const { showSnackbarAlert, SnackbarAlert } = useSnackbarAlert();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ValidateUserDto>({
    mode: 'all',
    criteriaMode: 'all',
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onFinish = async (data: ValidateUserDto) => {
    try {
      await auth.authenticate(data.email, data.password);
      setSuccess(true);
      setLoading(false);

      history('/');
    } catch (error) {
      setLoading(false);
      setSuccess(false);
      showSnackbarAlert({
        message: 'Erro no E-mail ou no Password',
        severity: 'error',
      });
    }
  };

  // const handleLogin = async (
  //   event: React.FormEvent<HTMLFormElement>
  // ): Promise<void> => {
  //   event.preventDefault();
  //   setSuccess(false);
  //   setLoading(true);
  //   const data = new FormData(event.currentTarget);

  //   await onFinish({
  //     email: `${data.get('email')}`,
  //     password: `${data.get('password')}`,
  //   });
  // };

  return (
    <>
      <FormAuthCard imageUrl={cardImage}>
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar
              sx={{
                mb: theme.spacing(1),
                bgcolor: 'secondary.main',
                height: theme.spacing(15),
                width: theme.spacing(15),
              }}
              src={logo}
            />
            <Typography component="h1" variant="h5">
              {title}
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit(onFinish)}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
                id="email"
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
                label={passwordLabel}
                type="password"
                autoComplete="current-password"
                {...register('password')}
              />
              <Box display="flex" justifyContent="space-between">
                <FormControlLabel
                  sx={{
                    display: 'flex',
                    justifySelf: 'start',
                  }}
                  control={<Checkbox value={remenberTitle} color="primary" />}
                  label={remenberTitle}
                />
                <Typography
                  component={Link}
                  underline="hover"
                  href={registerHref}
                >
                  {registerTitle}
                </Typography>
              </Box>
              <FormButton
                success={success}
                loading={loading}
                buttonTitle={buttonTitle}
              />
            </Box>
          </Box>
        </Container>
      </FormAuthCard>
      {SnackbarAlert}
    </>
  );
};
