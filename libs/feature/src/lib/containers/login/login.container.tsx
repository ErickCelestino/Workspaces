import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { FormAuthCard } from '../../components';
import { useAuth } from '../../hooks';
import { ValidateUserDto } from '@workspaces/domain';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbarAlert } from '../../hooks';

interface LoginContainerProps {
  cardImage: string;
  logo: string;
  title?: string;
  passwordLabel?: string;
  emailLabel?: string;
  buttonTitle?: string;
  remenberTitle?: string;
}

export const LoginContainer: React.FC<LoginContainerProps> = ({
  cardImage = '',
  logo = '',
  title = 'Fazer Login',
  passwordLabel = 'Digite seu Password',
  emailLabel = 'Digite seu Email',
  buttonTitle = 'Entrar',
  remenberTitle = 'Lembrar',
}) => {
  const auth = useAuth();
  const history = useNavigate();
  const theme = useTheme();
  const { showSnackbarAlert, SnackbarAlert } = useSnackbarAlert();

  const onFinish = async (data: ValidateUserDto) => {
    try {
      await auth.authenticate(data.email, data.password);
      history('/');
    } catch (error) {
      showSnackbarAlert({
        message: 'Erro no E-mail ou no Password',
        severity: 'error',
      });
    }
  };

  const handleLogin = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    await onFinish({
      email: `${data.get('email')}`,
      password: `${data.get('password')}`,
    });
  };

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
              onSubmit={handleLogin}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label={emailLabel}
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="password"
                label={passwordLabel}
                name="password"
                type="password"
                autoComplete="current-password"
              />
              <FormControlLabel
                sx={{
                  display: 'flex',
                  justifySelf: 'start',
                }}
                control={<Checkbox value={remenberTitle} color="primary" />}
                label={remenberTitle}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: theme.spacing(1),
                  mb: theme.spacing(1),
                  height: theme.spacing(8),
                  fontSize: '1.3rem',
                }}
              >
                {buttonTitle}
              </Button>
            </Box>
          </Box>
        </Container>
      </FormAuthCard>
      {SnackbarAlert}
    </>
  );
};
