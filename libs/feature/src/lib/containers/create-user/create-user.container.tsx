import { FC, useState } from 'react';
import { FormAuthCard, FormButton } from '../../components';
import { useSnackbarAlert } from '../../hooks';
import {
  Avatar,
  Box,
  Container,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { CreateUserRequest } from '../../services/http/user/create-user';
import { useForm } from 'react-hook-form';
import { CreateUserDto } from '@workspaces/domain';
import { setUserIdLocalStorage } from '../../services';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateUserSchema } from '../../shared';

interface CreateUserProps {
  cardImage: string;
  logo: string;
  title?: string;
  buttonTitle?: string;
  nameLabel?: string;
  nicknameLabel?: string;
  birthDateLabel?: string;
  passwordLabel?: string;
  confirmPasswordLabel?: string;
}

export const CreateUser: FC<CreateUserProps> = ({
  cardImage,
  logo,
  title = 'Fazer Cadastro',
  buttonTitle = 'Confirmar Cadastro',
  nameLabel = 'Digite seu Nome',
  nicknameLabel = 'Digite seu Nickname',
  birthDateLabel = 'Digite sua data de Nascimento',
  passwordLabel = 'Digite sua senha',
  confirmPasswordLabel = 'Digite sua senha novamente',
}) => {
  //const history = useNavigate();
  const theme = useTheme();
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
  const { showSnackbarAlert, SnackbarAlert } = useSnackbarAlert();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
              onSubmit={handleSubmit(handleData)}
              noValidate
              sx={{ mt: 1 }}
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
          </Box>
        </Container>
      </FormAuthCard>
      {SnackbarAlert}
    </>
  );
};
