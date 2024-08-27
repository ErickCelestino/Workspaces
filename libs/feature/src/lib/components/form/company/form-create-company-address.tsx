import {
  CompanyAddressResponseDto,
  CompanyBodyAddressDto,
  CreateCompanyAddressDto,
  ErrorResponse,
  StepItem,
} from '@workspaces/domain';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLoggedUser } from '../../../contexts';
import { CreateCompanyAddressRequest } from '../../../services';
import { Box, TextField } from '@mui/material';
import axios, { AxiosError } from 'axios';
import { ValidationsError } from '../../../shared';
import { FormButton } from '../form-button.component';

interface FormCreateCompanyAddressProps {
  showAlert: (message: string, success: boolean) => void;
  handlePopUpClose: () => void;
  step: StepItem;
  companyId: string;
  totalPosition: number;
  companyAddress: CompanyAddressResponseDto;
  buttonTitle?: string;
  successMessage?: string;
  zipcodeLabel?: string;
  streetLabel?: string;
  districtLabel?: string;
  complementLabel?: string;
  numberLabel?: string;
  cityLabel?: string;
  countryLabel?: string;
  stateLabel?: string;
}

export const FormCreateCompanyAddress: FC<FormCreateCompanyAddressProps> = ({
  showAlert,
  handlePopUpClose,
  companyId,
  companyAddress,
  step: { stepPosition = 4, stepTitle = 'Etapa' },
  totalPosition,
  successMessage = 'Endereço criado com sucesso',
  zipcodeLabel = 'CEP',
  streetLabel = 'Rua',
  districtLabel = 'Bairro',
  complementLabel = 'Complemento',
  numberLabel = 'Número',
  cityLabel = 'Cidade',
  countryLabel = 'País',
  stateLabel = 'Estado',
  buttonTitle = 'Adicionar Endereço',
}) => {
  const { loggedUser } = useLoggedUser();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<CompanyBodyAddressDto>({
    mode: 'all',
    criteriaMode: 'all',
    defaultValues: {
      cityId: companyAddress.city,
      countryId: companyAddress.country,
      stateId: companyAddress.state,
      complement: companyAddress.complement,
      district: companyAddress.district,
      number: companyAddress.number,
      street: companyAddress.street,
      zipcode: companyAddress.zipcode,
    },
  });

  const createCompanyAddress = async (input: CreateCompanyAddressDto) => {
    try {
      const result = await CreateCompanyAddressRequest(input);
      return result;
    } catch (error) {
      setLoading(false);
      setSuccess(false);
      console.error(error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        const errors = ValidationsError(axiosError, 'Endereço da Empresa');
        if (errors) {
          showAlert(errors, false);
        }
      }
    }
  };

  const handleCompanyData = async (data: CompanyBodyAddressDto) => {
    setLoading(true);
    setSuccess(false);
    const result = await createCompanyAddress({
      body: data,
      loggedUserId: loggedUser?.id ?? '',
      companyId,
    });
    if (result) {
      setLoading(false);
      setSuccess(true);
      setSuccess(false);
      reset({
        cityId: '',
        countryId: '',
        stateId: '',
        complement: '',
        district: '',
        number: '',
        street: '',
        zipcode: '',
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
        error={!!errors.zipcode}
        helperText={errors.zipcode ? errors.zipcode.message : ''}
        id="zipcode"
        disabled={loading}
        label={zipcodeLabel}
        autoComplete="zipcode"
        autoFocus
        {...register('zipcode')}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        error={!!errors.district}
        helperText={errors.district ? errors.district.message : ''}
        id="district"
        disabled={loading}
        label={districtLabel}
        autoComplete="district"
        {...register('district')}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        error={!!errors.number}
        helperText={errors.number ? errors.number.message : ''}
        id="number"
        disabled={loading}
        label={numberLabel}
        autoComplete="number"
        {...register('number')}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        error={!!errors.street}
        helperText={errors.street ? errors.street.message : ''}
        id="street"
        disabled={loading}
        label={streetLabel}
        autoComplete="street"
        {...register('street')}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        error={!!errors.complement}
        helperText={errors.complement ? errors.complement.message : ''}
        id="complement"
        disabled={loading}
        label={complementLabel}
        autoComplete="complement"
        {...register('complement')}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        error={!!errors.cityId}
        helperText={errors.cityId ? errors.cityId.message : ''}
        id="cityId"
        disabled={loading}
        label={cityLabel}
        autoComplete="cityId"
        {...register('cityId')}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        error={!!errors.countryId}
        helperText={errors.countryId ? errors.countryId.message : ''}
        id="countryId"
        disabled={loading}
        label={countryLabel}
        autoComplete="countryId"
        {...register('countryId')}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        error={!!errors.stateId}
        helperText={errors.stateId ? errors.stateId.message : ''}
        id="stateId"
        disabled={loading}
        label={stateLabel}
        autoComplete="stateId"
        {...register('stateId')}
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
