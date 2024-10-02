import {
  Device,
  DeviceBodyDto,
  EditDeviceDto,
  ErrorResponse,
} from '@workspaces/domain';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { EditDeviceFormSchema, ValidationsError } from '../../../shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoggedUser } from '../../../contexts';
import { Box, TextField, useMediaQuery, useTheme } from '@mui/material';
import axios, { AxiosError } from 'axios';
import { SimpleFormModal } from '../simple';
import { EditDeviceRequest } from '../../../services';
import { FormButton } from '../../form';

interface EditDeviceModalProps {
  idToEdit: string;
  open: boolean;
  title: string;
  handlePopUpClose: () => void;
  showAlert: (message: string, success: boolean) => void;
  nameLabel?: string;
  successMessage?: string;
  deviceToEdit: Device;
}

export const EditDeviceModal: FC<EditDeviceModalProps> = ({
  idToEdit,
  open,
  title,
  handlePopUpClose,
  showAlert,
  nameLabel = 'Nome',
  successMessage = 'Dispositivo Editado com Sucesso',
  deviceToEdit,
}) => {
  const { loggedUser } = useLoggedUser();
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<DeviceBodyDto>({
    mode: 'all',
    criteriaMode: 'all',
    resolver: zodResolver(EditDeviceFormSchema),
    defaultValues: {
      name: '',
    },
  });

  const editDevice = async (input: EditDeviceDto) => {
    try {
      const editedDevice = await EditDeviceRequest(input);
      if (Object.keys(editedDevice).length > 0) {
        setLoading(false);
        setSuccess(true);
        showAlert(successMessage, true);
        setSuccess(false);
        handlePopUpClose();
      }
    } catch (error) {
      setLoading(false);
      setSuccess(false);
      console.error(error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        const errors = ValidationsError(axiosError, 'Category');
        if (errors) {
          showAlert(errors, false);
        }
      }
    }
  };

  useEffect(() => {
    if (open && deviceToEdit?.id && !dataLoaded) {
      reset({
        name: deviceToEdit.name,
      });
      setDataLoaded(true);
    }
  }, [open, reset, deviceToEdit, dataLoaded]);

  useEffect(() => {
    if (!open) {
      setDataLoaded(false);
    }
  }, [open]);

  const handlePlaylistData = async (data: DeviceBodyDto) => {
    setLoading(true);
    setSuccess(false);
    editDevice({
      id: idToEdit,
      name: data.name,
      loggedUserId: loggedUser?.id ?? '',
    });
  };

  return (
    <SimpleFormModal
      height={theme.spacing(40)}
      width={smDown ? '90%' : theme.spacing(80)}
      open={open}
      handlePopUpClose={handlePopUpClose}
      title={title}
    >
      <Box
        sx={{ mt: 2 }}
        component="form"
        onSubmit={handleSubmit(handlePlaylistData)}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          InputLabelProps={{ shrink: true, required: true }}
          error={!!errors.name}
          helperText={errors.name?.message}
          id="name"
          disabled={loading}
          label={nameLabel}
          autoComplete="name"
          autoFocus
          {...register('name')}
        />

        <FormButton
          buttonTitle="Registrar"
          loading={loading}
          success={success}
        />
      </Box>
    </SimpleFormModal>
  );
};
