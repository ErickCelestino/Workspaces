import { FC, useState } from 'react';
import { useLoggedUser } from '../../../contexts';
import { Box, TextField, useMediaQuery, useTheme } from '@mui/material';
import {
  CompanyBodyDto,
  CreateCompanyDto,
  ErrorResponse,
} from '@workspaces/domain';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateCompanyFormSchema } from '../../../shared/validations/company/create-company.schema';
import { CreateCompanyRequest } from '../../../services';
import axios, { AxiosError } from 'axios';
import { ValidationsError } from '../../../shared';
import { SimpleFormModal } from '../simple';
import { FormButton } from '../../form';

interface CreateCompanyModalProps {
  open: boolean;
  title: string;
  handlePopUpClose: () => void;
  showAlert: (message: string, success: boolean) => void;
  fantasyNameLabel?: string;
  cnpjLabel?: string;
  socialReasonLabel?: string;
  successMessage?: string;
}

export const CreateCompanyModal: FC<CreateCompanyModalProps> = ({
  open,
  title,
  handlePopUpClose,
  showAlert,
  fantasyNameLabel = 'Nome Fantasia',
  cnpjLabel = 'CNPJ',
  socialReasonLabel = 'Razão Social',
  successMessage = 'Empresa criada com sucesso',
}) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const { loggedUser } = useLoggedUser();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<CompanyBodyDto>({
    mode: 'all',
    criteriaMode: 'all',
    resolver: zodResolver(CreateCompanyFormSchema),
    defaultValues: {
      cnpj: '',
      fantasyName: '',
      socialReason: '',
    },
  });

  const createDevice = async (input: CreateCompanyDto) => {
    try {
      const result = await CreateCompanyRequest(input);
      return result;
    } catch (error) {
      setLoading(false);
      setSuccess(false);
      console.log(error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        const errors = ValidationsError(axiosError, 'Empresa');
        if (errors) {
          showAlert(errors, false);
        }
      }
    }
  };

  const handleDeviceData = async (data: CompanyBodyDto) => {
    setLoading(true);
    setSuccess(false);
    const result = await createDevice({
      body: data,
      loggedUserId: loggedUser?.id ?? '',
    });
    if (result) {
      setLoading(false);
      setSuccess(true);
      setSuccess(false);
      reset({
        fantasyName: '',
        cnpj: '',
        socialReason: '',
      });
      showAlert(successMessage, true);
      handlePopUpClose();
    }
  };

  return (
    <SimpleFormModal
      open={open}
      handlePopUpClose={handlePopUpClose}
      height={theme.spacing(70)}
      width={smDown ? '90%' : theme.spacing(90)}
      title={title}
    >
      <Box
        sx={{ mt: 2 }}
        component="form"
        onSubmit={handleSubmit(handleDeviceData)}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          error={!!errors.fantasyName}
          helperText={errors.fantasyName ? errors.fantasyName.message : ''}
          id="fantasyName"
          disabled={loading}
          label={fantasyNameLabel}
          autoComplete="fantasyName"
          autoFocus
          {...register('fantasyName')}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          error={!!errors.cnpj}
          helperText={errors.cnpj ? errors.cnpj.message : ''}
          id="cnpj"
          disabled={loading}
          label={cnpjLabel}
          autoComplete="cnpj"
          {...register('cnpj')}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          error={!!errors.socialReason}
          helperText={errors.socialReason ? errors.socialReason.message : ''}
          id="socialReason"
          disabled={loading}
          label={socialReasonLabel}
          autoComplete="socialReason"
          {...register('socialReason')}
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 2,
          }}
        >
          <Box width="80%">
            <FormButton
              buttonTitle="Criar"
              loading={loading}
              success={success}
            />
          </Box>
        </Box>
      </Box>
    </SimpleFormModal>
  );
};
