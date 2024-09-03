import { Box, TextField } from '@mui/material';
import {
  CompanyBodyDto,
  EditCompanyDto,
  ErrorResponse,
  StepItem,
} from '@workspaces/domain';
import axios, { AxiosError } from 'axios';
import { FC, useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FormButton } from '../../form-button.component';
import { ValidationsError, formatValueMask } from '../../../../shared';
import { useLoggedUser } from '../../../../contexts';
import { EditCompanyRequest } from '../../../../services';

interface FormEditCompanyProps {
  showAlert: (message: string, success: boolean) => void;
  handlePopUpClose: () => void;
  companyId: string;
  step: StepItem;
  totalPosition: number;
  fantasyNameLabel?: string;
  cnpjLabel?: string;
  socialReasonLabel?: string;
  successMessage?: string;
  buttonTitle?: string;
}

export const FormEditCompany: FC<FormEditCompanyProps> = ({
  showAlert,
  handlePopUpClose,
  companyId,
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
  const [dataLoaded, setDataLoaded] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<CompanyBodyDto>({
    mode: 'all',
    criteriaMode: 'all',
    //resolver: zodResolver(CreateCompanyFormSchema),
    defaultValues: {
      cnpj: '',
      fantasyName: '',
      socialReason: '',
    },
  });

  useEffect(() => {
    if (Object.keys(companyId).length > 0) {
      setDataLoaded(false);
    }
  }, [companyId]);

  // const getCompany = useCallback(
  //   async (input: FindDeviceByIdDto) => {
  //     try {
  //       const result = await FindDeviceByIdRequest(input);
  //       reset({
  //         name: result.name,
  //       });
  //       setDataLoaded(true);
  //     } catch (error) {
  //       console.error(error);
  //       if (axios.isAxiosError(error)) {
  //         const axiosError = error as AxiosError<ErrorResponse>;
  //         const errors = ValidationsError(axiosError, 'Device');
  //         if (errors) {
  //           showAlert(errors, false);
  //         }
  //       }
  //     }
  //   },
  //   [showAlert, reset]
  // );

  const editCompany = async (input: EditCompanyDto) => {
    try {
      input.body.cnpj = input.body.cnpj.replace(/[^\d]+/g, '');
      const result = await EditCompanyRequest(input);
      return result;
    } catch (error) {
      setLoading(false);
      setSuccess(false);
      console.error(error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        const errors = ValidationsError(axiosError, 'Empresa');
        if (errors) {
          showAlert(errors, false);
        }
      }
    }
  };

  useEffect(() => {
    setValue('cnpj', formatValueMask('', 'cnpj'));
  }, [setValue]);

  const handleCompanyData = async (data: CompanyBodyDto) => {
    setLoading(true);
    setSuccess(false);
    const result = await editCompany({
      body: data,
      loggedUserId: loggedUser?.id ?? '',
      companyId: '',
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
    <Box
      sx={{ mt: 2 }}
      component="form"
      onSubmit={handleSubmit(handleCompanyData)}
    >
      <TextField
        margin="normal"
        required
        autoFocus
        fullWidth
        error={!!errors.socialReason}
        helperText={errors.socialReason ? errors.socialReason.message : ''}
        id="socialReason"
        disabled={loading}
        label={socialReasonLabel}
        autoComplete="socialReason"
        {...register('socialReason')}
      />

      <Controller
        name="cnpj"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            label="CNPJ"
            fullWidth
            margin="normal"
            error={!!errors.cnpj}
            helperText={errors.cnpj ? errors.cnpj.message : ''}
            onChange={(e) =>
              field.onChange(formatValueMask(e.target.value, 'cnpj'))
            }
            inputProps={{ maxLength: 18 }}
          />
        )}
      />

      <TextField
        margin="normal"
        fullWidth
        error={!!errors.fantasyName}
        helperText={errors.fantasyName ? errors.fantasyName.message : ''}
        id="fantasyName"
        disabled={loading}
        label={fantasyNameLabel}
        autoComplete="fantasyName"
        {...register('fantasyName')}
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
