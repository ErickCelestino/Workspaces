import { FC, useCallback, useEffect, useState } from 'react';
import { useLoggedUser } from '../../../contexts';
import {
  ErrorResponse,
  FindSchedulingByIdDto,
  Scheduling,
} from '@workspaces/domain';
import { FindSchedulingByIdRequest } from '../../../services';
import axios, { AxiosError } from 'axios';
import { formatBrDate, ValidationsError } from '../../../shared';
import { SimpleFormModal } from '../simple';
import { Box, Chip, Typography, useMediaQuery, useTheme } from '@mui/material';
import { DetailsSchedulingCard } from '../../card';

interface DetailsSchedulingModalProps {
  open: boolean;
  title: string;
  handlePopUpClose: () => void;
  showAlert: (message: string, success: boolean) => void;
  subTitle?: string;
  idToDetails: string;
  createByTitle?: string;
  createAtTitle?: string;
  startTimeTitle?: string;
  endTimeTitle?: string;
  loopingTitle?: string;
  priorityTitle?: string;
}

export const DetailsSchedulingModal: FC<DetailsSchedulingModalProps> = ({
  handlePopUpClose,
  showAlert,
  open,
  title,
  subTitle,
  idToDetails,
  createByTitle = 'Criado por: ',
  createAtTitle = 'Criado em: ',
  startTimeTitle = 'Início: ',
  endTimeTitle = 'Fim: ',
  loopingTitle = 'Repetir: ',
  priorityTitle = 'Prioridade: ',
}) => {
  const { loggedUser } = useLoggedUser();
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const [dataLoaded, setDataLoaded] = useState(false);
  const [schedulingDetails, setSchedulingDetails] = useState<Scheduling>(
    {} as Scheduling
  );

  useEffect(() => {
    if (!open) {
      setDataLoaded(false);
    }
  }, [open]);

  const getScheduling = useCallback(
    async (input: FindSchedulingByIdDto) => {
      try {
        const result = await FindSchedulingByIdRequest(input);
        setSchedulingDetails(result);
        setDataLoaded(true);
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

  useEffect(() => {
    if (open && idToDetails && !dataLoaded) {
      const loggedUserId = loggedUser?.id ?? '';

      getScheduling({
        id: idToDetails,
        loggedUserId: loggedUserId,
      });
    }
  }, [loggedUser, idToDetails, dataLoaded, open, getScheduling]);

  return (
    <SimpleFormModal
      height={smDown ? theme.spacing(55) : theme.spacing(62)}
      width={smDown ? '90%' : theme.spacing(80)}
      open={open}
      handlePopUpClose={handlePopUpClose}
      title={title}
    >
      <DetailsSchedulingCard
        createAtTitle={createAtTitle}
        createByTitle={createByTitle}
        endTimeTitle={endTimeTitle}
        loopingTitle={loopingTitle}
        priorityTitle={priorityTitle}
        startTimeTitle={startTimeTitle}
        schedulingDetails={schedulingDetails}
      />
    </SimpleFormModal>
  );
};
