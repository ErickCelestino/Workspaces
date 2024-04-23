import { Box, TextField, useTheme } from '@mui/material';
import { CreateCompanyDto, ErrorResponse } from '@workspaces/domain';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  EntityExist,
  EntityIsInvalid,
  EntityMinLength,
  createCompanySchema,
} from '../../shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormButton } from './form-button.component';
import { CreateCompanyRequest } from '../../services';
import axios, { AxiosError } from 'axios';
import { CompanyContact } from '../../shared/messages/company-contact';

interface FormCreateCompanyProps {
  fantasyNameLabel?: string;
  cnpjLabel?: string;
  buttonTitle?: string;
  showAlert?: (message: string) => void;
}

export const FormCreateCompany: FC<FormCreateCompanyProps> = ({
  fantasyNameLabel = 'Digite o nome fantasia',
  cnpjLabel = 'Digite o cnpj',
  buttonTitle = 'Cadastrar CNPJ',
  showAlert,
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const theme = useTheme();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CreateCompanyDto>({
    mode: 'all',
    criteriaMode: 'all',
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      fantasy_name: '',
      cnpj: '',
    },
  });

  const createCompany = async (request: CreateCompanyDto) => {
    try {
      const result = await CreateCompanyRequest(request);
      return result;
    } catch (error) {
      console.error((error as { message: string }).message);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        switch (axiosError.response?.data.error.name) {
          case 'EntityAlreadyExists':
            showAlert?.(EntityExist(request.fantasy_name, 'Nome Fantasia'));
            break;
          case 'InsufficientCharacters':
            showAlert?.(
              EntityMinLength(
                { entity: 'CNPJ ou Nome Fantasia', minOrMax: 2 },
                'PT-BR'
              )
            );
            break;
          case 'EntityIsInvalid':
            showAlert?.(EntityIsInvalid(request.cnpj, 'PT-BR'));
            break;
          default:
            showAlert?.(CompanyContact('PT-BR'));
            break;
        }
      }
      setLoading(false);
    }
  };

  const handleData = async (data: CreateCompanyDto) => {
    setLoading(true);
    setSuccess(false);
    await createCompany(data);
    setLoading(false);
    setSuccess(true);
  };

  return (
    <Box
      component="form"
      display="flex"
      height="100%"
      width="100%"
      justifyContent="center"
      onSubmit={handleSubmit(handleData)}
    >
      <Box width={theme.spacing(80)}>
        <TextField
          margin="normal"
          required
          fullWidth
          error={!!errors.fantasy_name}
          helperText={errors.fantasy_name?.message}
          id="fantasy_name"
          disabled={loading}
          autoComplete="fantasy_name"
          autoFocus
          label={fantasyNameLabel}
          {...register('fantasy_name')}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          error={!!errors.cnpj}
          helperText={errors.cnpj?.message}
          id="cnpj"
          disabled={loading}
          autoComplete="cnpj"
          label={cnpjLabel}
          {...register('cnpj')}
        />

        <FormButton
          success={success}
          loading={loading}
          buttonTitle={buttonTitle}
        />
      </Box>
    </Box>
  );
};
