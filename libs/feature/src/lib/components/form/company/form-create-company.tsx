import { zodResolver } from '@hookform/resolvers/zod';
import { Box, TextField } from '@mui/material';
import {
  CompanyBodyDto,
  CreateCompanyDto,
  ErrorResponse,
  StepItem,
} from '@workspaces/domain';
import { useForm } from 'react-hook-form';
import { CreateCompanyFormSchema } from '../../../shared/validations/company/create-company.schema';
import { FC, useState } from 'react';
import { CreateCompanyRequest } from '../../../services';
import axios, { AxiosError } from 'axios';
import { ValidationsError } from '../../../shared';
import { FormButton } from '../form-button.component';
import { useLoggedUser } from '../../../contexts';

interface FormCreateCompanyProps {
  showAlert: (message: string, success: boolean) => void;
  handlePopUpClose: () => void;
  changeCompanyId: (companyId: string) => void;
  step: StepItem;
  totalPosition: number;
  fantasyNameLabel?: string;
  cnpjLabel?: string;
  socialReasonLabel?: string;
  successMessage?: string;
  buttonTitle?: string;
}

export const FormCreateCompany: FC<FormCreateCompanyProps> = ({
  showAlert,
  handlePopUpClose,
  changeCompanyId,
  totalPosition,
  step: { stepPosition = 1, stepTitle = 'Etapa' },
  fantasyNameLabel = 'Nome Fantasia',
  cnpjLabel = 'CNPJ',
  socialReasonLabel = 'Razão Social',
  successMessage = 'Empresa criada com sucesso',
  buttonTitle = 'Adicionar Empresa',
}) => {
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

  const createCompany = async (input: CreateCompanyDto) => {
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

  const handleCompanyData = async (data: CompanyBodyDto) => {
    setLoading(true);
    setSuccess(false);
    const result = await createCompany({
      body: data,
      loggedUserId: loggedUser?.id ?? '',
    });
    if (result) {
      changeCompanyId(result.companyId);
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
    <Box
      sx={{ mt: 2 }}
      component="form"
      onSubmit={handleSubmit(handleCompanyData)}
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
            buttonTitle={`${buttonTitle} (${stepTitle} - ${stepPosition}/${totalPosition})`}
            loading={loading}
            success={success}
          />
        </Box>
      </Box>
    </Box>
  );
};
