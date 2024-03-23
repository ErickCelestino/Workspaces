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
import React, { useState } from 'react';
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
  registerTitle?: string;
  registerHref?: string;
}

export const LoginContainer: React.FC<LoginContainerProps> = ({
  cardImage = '',
  logo = '',
  title = 'Fazer Login',
  passwordLabel = 'Digite seu Password',
  emailLabel = 'Digite seu Email',
  buttonTitle = 'Entrar',
  remenberTitle = 'Lembrar',
  registerTitle = 'Quer se cadastrar?',
  registerHref = '/register',
}) => {
  const auth = useAuth();
  const history = useNavigate();
  const theme = useTheme();
  const { showSnackbarAlert, SnackbarAlert } = useSnackbarAlert();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onFinish = async (data: ValidateUserDto) => {
    try {
      setSuccess(false);
      setLoading(true);
      await auth.authenticate(data.email, data.password);
      setSuccess(true);
      setLoading(false);

      history('/');
    } catch (error) {
      //setLoading(false);
      //setSuccess(false);
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
