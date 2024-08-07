import { FC, useCallback, useEffect, useState } from 'react';
import { useLoggedUser } from '../../../contexts';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import {
  AddSchedulesToDeviceDto,
  ErrorResponse,
  ListSchedulesDto,
  Scheduling,
} from '@workspaces/domain';
import {
  AddSchedulesToDeviceRequest,
  ListSchedulesRequest,
} from '../../../services';
import axios, { AxiosError } from 'axios';
import { ValidationsError } from '../../../shared';
import { SimpleFormModal } from '../simple';

interface AddSchedulesToDeviceModalProps {
  open: boolean;
  title: string;
  idDevice: string;
  handlePopUpClose: () => void;
  showAlert: (message: string, success: boolean) => void;
  schedulesTitle?: string;
  successMessage?: string;
}

export const AddSchedulesToDeviceModal: FC<AddSchedulesToDeviceModalProps> = ({
  handlePopUpClose,
  showAlert,
  title,
  open,
  idDevice,
  schedulesTitle = 'Selecione os Agendamentos',
  successMessage = 'Agendamentos Adicionada com Sucesso',
}) => {
  const { loggedUser } = useLoggedUser();
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const [dataLoaded, setDataLoaded] = useState(false);
  const [listSchedules, setListSchedules] = useState<Scheduling[]>([]);
  const [selectedSchedules, setSelectedSchedules] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [totalPage, setTotalPage] = useState<number>(1);

  useEffect(() => {
    if (!open) {
      setDataLoaded(false);
    }
  }, [open]);

  const getSchedules = useCallback(
    async (input: ListSchedulesDto) => {
      try {
        const result = await ListSchedulesRequest(input);
        return result;
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ErrorResponse>;
          const errors = ValidationsError(axiosError, 'Agendamento');
          if (errors) {
            showAlert(errors, false);
          }
        }
      }
    },
    [showAlert]
  );

  const handleSchedulingToggle = (playlistId: string) => {
    const currentIndex = selectedSchedules.indexOf(playlistId);
    const newChecked = [...selectedSchedules];

    if (currentIndex === -1) {
      newChecked.push(playlistId);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setSelectedSchedules(newChecked);
  };

  const addSchedulesToDevice = async (data: AddSchedulesToDeviceDto) => {
    try {
      const result = await AddSchedulesToDeviceRequest(data);

      if (result) {
        setLoading(false);
        setSuccess(true);
        showAlert(successMessage, true);
        handlePopUpClose();
        setSuccess(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      setSuccess(false);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        const errors = ValidationsError(
          axiosError,
          'Agendamento ou Dispositivo'
        );
        if (errors) {
          showAlert(errors, false);
        }
      }
    }
  };

  const handleAddSchedules = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setSuccess(false);
    setLoading(true);
    await addSchedulesToDevice({
      loggedUserId: loggedUser?.id ?? '',
      idDevice: idDevice,
      schedulesIds: selectedSchedules,
    });
  };

  return (
    <SimpleFormModal
      height={smDown ? theme.spacing(73) : theme.spacing(72)}
      width={smDown ? '90%' : theme.spacing(80)}
      open={open}
      handlePopUpClose={handlePopUpClose}
      title={title}
    >
      <Box component="form" onSubmit={handleAddSchedules}></Box>
    </SimpleFormModal>
  );
};
