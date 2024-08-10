import {
  Box,
  Divider,
  List,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import { useLoggedUser } from '../../../contexts';
import { FC, useCallback, useEffect, useState } from 'react';
import {
  Device,
  ErrorResponse,
  FindDeviceByIdDto,
  FindSchedulesByDeviceIdDto,
  IconMenuItem,
  Scheduling,
} from '@workspaces/domain';
import {
  FindDeviceByIdRequest,
  FindSchedulesByDeviceIdRequest,
} from '../../../services';
import axios, { AxiosError } from 'axios';
import { formatBrDate, ValidationsError } from '../../../shared';
import { SimpleFormModal } from '../simple';
import { ButtonFileMenu } from '../../menu';
import {
  EmptyListResponse,
  SchedulingItem,
  SchedulingSimpleItem,
} from '../../list';

interface DetailsDeviceModalProps {
  open: boolean;
  title: string;
  idDevice: string;
  schedulesTitle?: string;
  handlePopUpClose: () => void;
  showAlert: (message: string, success: boolean) => void;
}

export const DetailsDeviceModal: FC<DetailsDeviceModalProps> = ({
  handlePopUpClose,
  showAlert,
  title,
  open,
  idDevice,
  schedulesTitle = 'Agendamentos',
}) => {
  const { loggedUser } = useLoggedUser();
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const [schedules, setSchedules] = useState<Scheduling[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [deviceDetails, setDeviceDetails] = useState<Device>({} as Device);
  const [selectedSchedules, setSelectedSchedules] = useState<
    Record<string, boolean>
  >({});
  const [deleteSchedulesPopUp, setDeleteSchedulesPopUp] = useState(false);

  const getDevice = useCallback(
    async (input: FindDeviceByIdDto) => {
      try {
        const result = await FindDeviceByIdRequest(input);
        setDeviceDetails(result);
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ErrorResponse>;
          const errors = ValidationsError(axiosError, 'Playlist');
          if (errors) {
            showAlert(errors, false);
          }
        }
      }
    },
    [showAlert]
  );

  const getSchedulesToDevice = useCallback(
    async (input: FindSchedulesByDeviceIdDto) => {
      try {
        const result = await FindSchedulesByDeviceIdRequest(input);
        setSchedules(result);
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ErrorResponse>;
          const errors = ValidationsError(axiosError, 'Arquivos');
          if (errors) {
            showAlert(errors, false);
          }
        }
      }
    },
    [showAlert]
  );

  useEffect(() => {
    if (!open) {
      setDataLoaded(false);
    }
  }, [open]);

  useEffect(() => {
    if (open && idDevice && !dataLoaded) {
      getDevice({
        loggedUserId: loggedUser?.id ?? '',
        id: idDevice,
      });
      getSchedulesToDevice({
        idDevice,
        loggedUserId: loggedUser?.id ?? '',
      });
    }
  }, [open, idDevice, dataLoaded, getDevice, loggedUser, getSchedulesToDevice]);

  const handleSchedulingToggle = (fileId: string) => {
    setSelectedSchedules((prevSelectedScheduling) => {
      const newSelectedSchedules = {
        ...prevSelectedScheduling,
        [fileId]: !prevSelectedScheduling[fileId],
      };
      return newSelectedSchedules;
    });
  };

  const handlePopUpOpen = (types: 'delete-scheduling', id?: string) => {
    const selecteFileMessage = 'Selecione um Agendamento para mover';
    switch (types) {
      case 'delete-scheduling':
        if (Object.keys(selectedSchedules).length > 0) {
          setDeleteSchedulesPopUp(true);
        } else {
          showAlert(selecteFileMessage, false);
        }
        break;
    }
  };

  const iconMenuList: IconMenuItem[] = [
    {
      icon: <DeleteSweepIcon />,
      title: 'Deletar Arquivos',
      handleClick: async () => handlePopUpOpen('delete-scheduling'),
    },
  ];

  return (
    <SimpleFormModal
      height={smDown ? theme.spacing(55) : theme.spacing(80)}
      width={smDown ? '90%' : theme.spacing(80)}
      open={open}
      handlePopUpClose={handlePopUpClose}
      title={title}
    >
      <Box sx={{ padding: theme.spacing(2) }}>
        <Typography
          sx={{
            fontSize: '18px',
          }}
        >
          <strong>Nome: </strong>
          {deviceDetails?.name ?? ''}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            sx={{
              fontSize: '18px',
            }}
          >
            <strong>Criado por: </strong>
            {deviceDetails?.createdBy ?? ''}
          </Typography>
          <Typography>
            <strong>Criado em: </strong>
            {formatBrDate(new Date(deviceDetails?.createdAt ?? new Date()))}
          </Typography>
        </Box>
        <Divider
          sx={{
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
          }}
        />

        <Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h5">
              <strong>{schedulesTitle}</strong>
            </Typography>
            <ButtonFileMenu iconMenuItemList={iconMenuList} />
          </Box>
          <List>
            {schedules.length > 0 ? (
              schedules.map((scheduling) => (
                <SchedulingSimpleItem
                  scheduling={scheduling}
                  key={scheduling.id}
                />
              ))
            ) : (
              <EmptyListResponse
                message="Sem Playlist"
                icon={
                  <PlaylistRemoveIcon
                    sx={{
                      fontSize: theme.spacing(10),
                    }}
                  />
                }
              />
            )}
          </List>
        </Box>
      </Box>
    </SimpleFormModal>
  );
};
