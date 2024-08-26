import {
  CompanyDataBodyDto,
  CreateCompanyDataDto,
  ErrorResponse,
  StepItem,
} from '@workspaces/domain';
import { FC, useRef, useState } from 'react';
import { useLoggedUser } from '../../../contexts';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateCompanyDataFormSchema } from '../../../shared/validations/company';
import { CreateCompanyDataRequest } from '../../../services';
import axios, { AxiosError } from 'axios';
import { ValidationsError } from '../../../shared';
import { Box, TextField } from '@mui/material';
import { FormButton } from '../form-button.component';
import { MaskedInput } from '../../text-field';
interface FormCreateCompanyDataProps {
  showAlert: (message: string, success: boolean) => void;
  handlePopUpClose: () => void;
  step: StepItem;
  companyId: string;
  totalPosition: number;
  portLabel?: string;
  openingLabel?: string;
  situationLabel?: string;
  legalNatureLabel?: string;
  phoneLabel?: string;
  responsibleEmailLabel?: string;
  successMessage?: string;
  buttonTitle?: string;
}

export const FormCreateCompanyData: FC<FormCreateCompanyDataProps> = ({
  showAlert,
  handlePopUpClose,
  companyId,
  step: { stepPosition = 1, stepTitle = 'Etapa' },
  totalPosition,
  portLabel = 'Porto',
  openingLabel = 'Abertura',
  situationLabel = 'Situação',
  legalNatureLabel = 'Natureza Jurídica',
  phoneLabel = 'Telefone',
  responsibleEmailLabel = 'Email Responsável',
  successMessage = 'Empresa criada com sucesso',
  buttonTitle = 'Adicionar Empresa',
}) => {
  const { loggedUser } = useLoggedUser();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<CompanyDataBodyDto>({
    mode: 'all',
    criteriaMode: 'all',
    resolver: zodResolver(CreateCompanyDataFormSchema),
    defaultValues: {
      legalNature: '',
      opening: '',
      phone: '',
      port: '',
      responsibleEmail: '',
      situation: '',
    },
  });

  const createCompanyData = async (input: CreateCompanyDataDto) => {
    try {
      const result = await CreateCompanyDataRequest(input);
      return result;
    } catch (error) {
      setLoading(false);
      setSuccess(false);
      console.log(error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        const errors = ValidationsError(axiosError, 'Dados da Empresa');
        if (errors) {
          showAlert(errors, false);
        }
      }
    }
  };

  const handleCompanyData = async (data: CompanyDataBodyDto) => {
    setLoading(true);
    setSuccess(false);
    const result = await createCompanyData({
      body: data,
      loggedUserId: loggedUser?.id ?? '',
      companyId,
    });
    if (result) {
      setLoading(false);
      setSuccess(true);
      setSuccess(false);
      reset({
        legalNature: '',
        opening: '',
        phone: '',
        port: '',
        responsibleEmail: '',
        situation: '',
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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Box width="48%">
          <TextField
            margin="normal"
            required
            fullWidth
            error={!!errors.legalNature}
            helperText={errors.legalNature ? errors.legalNature.message : ''}
            id="legalNature"
            disabled={loading}
            label={legalNatureLabel}
            autoComplete="legalNature"
            autoFocus
            {...register('legalNature')}
          />
        </Box>
        <Box width="48%">
          <TextField
            margin="normal"
            required
            fullWidth
            type="date"
            error={!!errors.opening}
            helperText={errors.opening ? errors.opening.message : ''}
            InputLabelProps={{ shrink: true, required: true }}
            id="opening"
            disabled={loading}
            label={openingLabel}
            autoComplete="opening"
            {...register('opening')}
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Box width="48%">
          <MaskedInput
            maskType="phone"
            margin="normal"
            required
            fullWidth
            error={!!errors.phone}
            helperText={errors.phone ? errors.phone.message : ''}
            id="phone"
            disabled={loading}
            label={phoneLabel}
            autoComplete="phone"
            {...register('phone')}
            inputRef={inputRef}
          />
        </Box>
        <Box width="48%">
          <TextField
            margin="normal"
            required
            fullWidth
            error={!!errors.port}
            helperText={errors.port ? errors.port.message : ''}
            id="port"
            disabled={loading}
            label={portLabel}
            autoComplete="port"
            {...register('port')}
          />
        </Box>
      </Box>
      <TextField
        margin="normal"
        required
        fullWidth
        error={!!errors.responsibleEmail}
        helperText={
          errors.responsibleEmail ? errors.responsibleEmail.message : ''
        }
        id="responsibleEmail"
        disabled={loading}
        label={responsibleEmailLabel}
        autoComplete="responsibleEmail"
        {...register('responsibleEmail')}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        error={!!errors.situation}
        helperText={errors.situation ? errors.situation.message : ''}
        id="situation"
        disabled={loading}
        label={situationLabel}
        autoComplete="situation"
        {...register('situation')}
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
