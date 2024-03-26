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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { CreateUserRequest } from '../../services/http/user/create-user';
import { CreateUserDto } from '@workspaces/domain';

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
  const { SnackbarAlert } = useSnackbarAlert();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const createUser = (data: CreateUserDto) => {
    const result = CreateUserRequest(data);
    return result;
  };

  const handleData = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess(false);
    setLoading(true);
    const data = new FormData(event.currentTarget);

    const createdUserId = await createUser({
      name: `${data.get('name')}`,
      nickname: `${data.get('nickname')}`,
      birthDate: new Date(`${data.get('bithDate')}`),
    });

    console.log(createdUserId);
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                onSubmit={handleData}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label={nameLabel}
                  name="name"
                  autoComplete="name"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="nickname"
                  label={nicknameLabel}
                  name="nickname"
                  autoComplete="nickname"
                />
                <DatePicker
                  sx={{
                    width: '100%',
                  }}
                  label={birthDateLabel}
                  name="bithDate"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="password"
                  label={passwordLabel}
                  name="password"
                  autoComplete="password"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="confirmPassword"
                  label={confirmPasswordLabel}
                  name="confirmPassword"
                  autoComplete="confirmPassword"
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
      </LocalizationProvider>
      {SnackbarAlert}
    </>
  );
};
