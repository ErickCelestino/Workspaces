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
import OpenWithIcon from '@mui/icons-material/OpenWith';
import { useLoggedUser } from '../../../contexts';
import { FC, useEffect, useState } from 'react';
import { IconMenuItem } from '@workspaces/domain';
import { SimpleFormModal } from '../simple';
import { ButtonFileMenu } from '../../menu';
import { EmptyListResponse, SchedulingSimpleItem } from '../../list';
import {
  DeleteSchedulesToDeviceModal,
  MoveSchedulesToAnotherDeviceModal,
} from '../schedules-to-device';
import {
  useFindDeviceByIdData,
  useFindSchedulesByDeviceIdData,
} from '../../../hooks';
import { formatBrDate } from '../../../shared';

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
  title = '',
  open,
  idDevice = '',
  schedulesTitle = 'Agendamentos',
}) => {
  const { loggedUser } = useLoggedUser();
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedSchedules, setSelectedSchedules] = useState<
    Record<string, boolean>
  >({});
  const [deleteSchedulesPopUp, setDeleteSchedulesPopUp] = useState(false);
  const [moveSchedulesPopUp, setMoveSchedulesPopUp] = useState(false);
  const { deviceById, getDeviceByIdData } = useFindDeviceByIdData({
    input: {
      id: idDevice,
      loggedUserId: loggedUser?.id ?? '',
    },
    showAlert,
  });

  const { getListSchedulesByDeviceIdData, listSchedulesByDeviceId } =
    useFindSchedulesByDeviceIdData({
      findSchedulesByDeviceIdDto: {
        idDevice,
        loggedUserId: loggedUser?.id ?? '',
      },
      showAlert,
    });

  const getSelectedSchedulingIds = () => {
    return Object.keys(selectedSchedules).filter(
      (fileId) => selectedSchedules[fileId]
    );
  };

  useEffect(() => {
    if (!open) {
      setDataLoaded(false);
    }
  }, [open]);

  useEffect(() => {
    if (open && idDevice && !dataLoaded) {
      getDeviceByIdData();
      getListSchedulesByDeviceIdData();
    }
  }, [
    open,
    idDevice,
    dataLoaded,
    getDeviceByIdData,
    loggedUser,
    getListSchedulesByDeviceIdData,
  ]);

  const handleSchedulingToggle = (schedulingId: string) => {
    setSelectedSchedules((prevSelectedSchedules) => {
      const newSelectedSchedules = {
        ...prevSelectedSchedules,
        [schedulingId]: !prevSelectedSchedules[schedulingId],
      };
      return newSelectedSchedules;
    });
  };

  const handlePopUpOpen = (types: 'delete-scheduling' | 'move-scheduling') => {
    const selecteFileMessage = 'Selecione um Agendamento para mover';
    const selectedIds = getSelectedSchedulingIds();
    switch (types) {
      case 'delete-scheduling':
        if (selectedIds.length > 0) {
          setDeleteSchedulesPopUp(true);
        } else {
          showAlert(selecteFileMessage, false);
        }
        break;
      case 'move-scheduling':
        if (selectedIds.length > 0) {
          setMoveSchedulesPopUp(true);
        } else {
          showAlert(selecteFileMessage, false);
        }
        break;
    }
  };

  const iconMenuList: IconMenuItem[] = [
    {
      icon: <DeleteSweepIcon />,
      title: 'Deletar Agendamentos',
      handleClick: async () => handlePopUpOpen('delete-scheduling'),
    },
    {
      icon: <OpenWithIcon />,
      title: 'Mover Agendamentos',
      handleClick: async () => handlePopUpOpen('move-scheduling'),
    },
  ];

  return (
    <>
      <DeleteSchedulesToDeviceModal
        idDevice={idDevice}
        loggedUserId={loggedUser?.id ?? ''}
        open={deleteSchedulesPopUp}
        title="Deletar Agendamento"
        schedulesIds={getSelectedSchedulingIds()}
        showAlert={showAlert}
        onClose={() => setDeleteSchedulesPopUp(false)}
        subTitle={`Deseja realmente deletar os ${
          getSelectedSchedulingIds().length
        } agendamentos selecionados?`}
      />
      <MoveSchedulesToAnotherDeviceModal
        open={moveSchedulesPopUp}
        oldDeviceId={idDevice}
        loggedUserId={loggedUser?.id ?? ''}
        selectedSchedules={getSelectedSchedulingIds()}
        showAlert={showAlert}
        onClose={() => setMoveSchedulesPopUp(false)}
        title="Mover Agendamentos"
        companyId={loggedUser?.selectedCompany.id ?? ''}
      />
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
            {deviceById?.name ?? ''}
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
              {deviceById?.createdBy ?? ''}
            </Typography>
            <Typography>
              <strong>Criado em: </strong>
              {formatBrDate(new Date(deviceById?.createdAt ?? new Date()))}
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
              {listSchedulesByDeviceId.length > 0 ? (
                listSchedulesByDeviceId.map((scheduling) => (
                  <SchedulingSimpleItem
                    scheduling={scheduling}
                    key={scheduling.id}
                    isSelected={selectedSchedules[scheduling.id]}
                    onSchedulingToggle={handleSchedulingToggle}
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
    </>
  );
};
