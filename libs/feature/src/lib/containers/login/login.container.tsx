import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  TextField,
  Typography,
} from '@mui/material';
import { FormAuthCard } from '../../components';
import { useAuth } from '../../context/auth-provider/useAuth';
import { ValidateUserDto } from '@workspaces/domain';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const LoginContainer: React.FC = () => {
  const auth = useAuth();
  const history = useNavigate();

  const onFinish = async (data: ValidateUserDto) => {
    try {
      await auth.authenticate(data.email, data.password);
      history('/');
    } catch (error) {
      console.error('Invalid email or password');
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
    <FormAuthCard imageUrl="/assets/svg/login-image.svg">
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar
            sx={{ mb: 2, bgcolor: 'secondary.main', height: 85, width: 85 }}
            src="/assets/png/summons-image.png"
          />
          <Typography component="h1" variant="h5">
            Fazer Login
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
              label="Digite seu Email"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              label="Digite seu Password"
              name="password"
              type="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              sx={{
                display: 'flex',
                justifySelf: 'start',
              }}
              control={<Checkbox value="lembrar" color="primary" />}
              label="Lembrar"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, height: '4rem', fontSize: '1.3rem' }}
            >
              Entrar
            </Button>
          </Box>
        </Box>
      </Container>
    </FormAuthCard>
  );
};
