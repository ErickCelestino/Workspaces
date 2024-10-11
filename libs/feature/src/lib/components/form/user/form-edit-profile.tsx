import { Box, TextField, useMediaQuery, useTheme } from '@mui/material';
import {
  BodyProfileBodyDto,
  EditProfileDto,
  ErrorResponse,
} from '@workspaces/domain';
import { FC, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { EditProfileSchema, ValidationsError } from '../../../shared';
import { EditProfileRequest } from '../../../services';
import { FormButton } from '../form-button.component';
import axios, { AxiosError } from 'axios';
import { useLoggedUser } from '../../../contexts';
import { zodResolver } from '@hookform/resolvers/zod';

interface FormEditProfileProps {
  nameLabel?: string;
  nicknameLabel?: string;
  birthDateLabel?: string;
  userProfileData: BodyProfileBodyDto;
  showAlert: (message: string, success: boolean) => void;
  inLoading?: string;
  buttonTitle?: string;
}

export const FormEditProfile: FC<FormEditProfileProps> = ({
  showAlert,
  userProfileData,
  inLoading = 'Salvando...',
  buttonTitle = 'Salvar Alteração',
  nameLabel = 'Nome',
  birthDateLabel = 'Data de Aniversário',
  nicknameLabel = 'Nickname',
}) => {
  const { loggedUser } = useLoggedUser();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const theme = useTheme();
  const mdDown = useMediaQuery(theme.breakpoints.down('md'));
  const hasLoadedUserData = useRef(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<BodyProfileBodyDto>({
    mode: 'all',
    criteriaMode: 'all',
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      name: '',
      birthDate: new Date(),
      nickname: '',
    },
  });

  useEffect(() => {
    if (!hasLoadedUserData.current) {
      const formattedBirthDate = userProfileData.birthDate
        ? new Date(userProfileData.birthDate).toISOString().split('T')[0]
        : new Date();
      reset({
        birthDate: formattedBirthDate as Date,
        name: userProfileData.name,
        nickname: userProfileData.nickname,
      });
      hasLoadedUserData.current = true;
    }
  }, [reset, userProfileData]);

  const editProfile = async (request: EditProfileDto) => {
    try {
      const result = await EditProfileRequest(request);
      if (result) {
        setSuccess(true);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      console.error((error as { message: string }).message);
      console.error(error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        const errors = ValidationsError(axiosError, 'Perfil');
        if (errors) {
          showAlert(errors, false);
        }
      }
      setLoading(false);
    }
  };

  const handleUserData = async (data: BodyProfileBodyDto) => {
    setSuccess(false);
    setLoading(true);
    await editProfile({
      body: data,
      loggedUserId: loggedUser?.id ?? '',
      userId: loggedUser?.id ?? '',
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleUserData)}>
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
        InputLabelProps={{ shrink: true, required: true }}
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
      <Box
        sx={{
          marginTop: mdDown ? '1rem' : '4rem',
        }}
      >
        <FormButton
          buttonTitle={loading ? inLoading : buttonTitle}
          loading={loading}
          success={success}
        />
      </Box>
    </Box>
  );
};
