import { List, useTheme } from '@mui/material';
import AlarmAddIcon from '@mui/icons-material/AlarmAdd';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import { LayoutBase } from '../../layout';
import {
  AddPlaylistToSchedulingModal,
  CreateSchedulingModal,
  DeleteSchedulingModal,
  DetailsSchedulingModal,
  EditSchedulingModal,
  EmptyListResponse,
  SchedulingItem,
  ToolbarPureTV,
} from '../../components';
import { ContainerSimpleList } from '../utils';
import { useCallback, useEffect, useState } from 'react';
import {
  CrudType,
  ErrorResponse,
  IconMenuItem,
  ListSchedulesDto,
  Scheduling,
} from '@workspaces/domain';
import { useSnackbarAlert } from '../../hooks';
import { ListSchedulesRequest } from '../../services';
import axios, { AxiosError } from 'axios';
import { ValidationsError } from '../../shared';
import { useLoggedUser } from '../../contexts';

export const ListSchedulesContainer = () => {
  const { loggedUser } = useLoggedUser();
  const theme = useTheme();

  const [listSchedules, setListSchedules] = useState<Scheduling[]>([]);
  const { showSnackbarAlert, SnackbarAlert } = useSnackbarAlert();
  const [totalPage, setTotalPage] = useState<number>(1);
  const [createSchedulingPopUp, setCreateSchedulingPopUp] = useState(false);
  const [deleteSchedulingPopUp, setDeleteSchedulingPopUp] = useState(false);
  const [editSchedulingPopUp, setEditSchedulingPopUp] = useState(false);
  const [detailsSchedulingPopUp, setDetailsSchedulingPopUp] = useState(false);
  const [addPlaylistToSchedulingPopUp, setAddPlaylistToSchedulingPopUp] =
    useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  const showAlert = useCallback(
    (message: string, success: boolean) => {
      showSnackbarAlert({
        message: message,
        severity: success ? 'success' : 'error',
      });
    },
    [showSnackbarAlert]
  );

  const handleData = useCallback(
    async (data: ListSchedulesDto) => {
      try {
        const result = await ListSchedulesRequest({
          loggedUserId: data.loggedUserId,
          companyId: data.companyId,
          filter: data.filter,
          skip: data.skip,
          take: data.take,
        });
        if (result) {
          setListSchedules(result.schedules);
          setTotalPage(result.totalPages);
        }
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

  useEffect(() => {
    setIsMounted(false);
  }, [loggedUser?.selectedCompany.id]);

  const getData = useCallback(async () => {
    const result = await handleData({
      companyId: loggedUser?.selectedCompany.id ?? '',
      loggedUserId: loggedUser?.id ?? '',
      filter: '',
    });
    if (result) {
      setTotalPage(result?.totalPages ?? 0);
      setListSchedules(result?.schedules ?? []);
    }
  }, [loggedUser, handleData]);

  useEffect(() => {
    if (!isMounted) {
      getData();
      setIsMounted(true);
    }
  }, [isMounted, handleData]);

  const handlePopUpOpen = (types: CrudType | 'add-playlist', id?: string) => {
    switch (types) {
      case 'create':
        setCreateSchedulingPopUp(true);
        break;
      case 'edit':
        setSelectedId(id ?? '');
        setEditSchedulingPopUp(true);
        break;
      case 'delete':
        setSelectedId(id ?? '');
        setDeleteSchedulingPopUp(true);
        break;
      case 'add-playlist':
        setSelectedId(id ?? '');
        setAddPlaylistToSchedulingPopUp(true);
        break;
      case 'details':
        setSelectedId(id ?? '');
        setDetailsSchedulingPopUp(true);
    }
  };

  const handlePopUpClose = (types: CrudType | 'add-playlist') => {
    getData();
    switch (types) {
      case 'create':
        setCreateSchedulingPopUp(false);
        break;
      case 'delete':
        setDeleteSchedulingPopUp(false);
        break;
      case 'edit':
        setEditSchedulingPopUp(false);
        break;
      case 'add-playlist':
        setAddPlaylistToSchedulingPopUp(false);
        break;
      case 'details':
        setDetailsSchedulingPopUp(false);
        break;
    }
  };

  const searchData = async (input: string) => {
    const result = await handleData({
      loggedUserId: loggedUser?.id ?? '',
      companyId: loggedUser?.selectedCompany.id ?? '',
      filter: input,
    });

    if (result) {
      setListSchedules(result.schedules);
      setTotalPage(result.totalPages);
    }
  };

  const handleChange = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    const result = await ListSchedulesRequest({
      loggedUserId: loggedUser?.id ?? '',
      companyId: loggedUser?.selectedCompany.id ?? '',
      filter: '',
      skip: (value - 1) * 6,
    });

    if (result) {
      setListSchedules(result.schedules);
      setTotalPage(result.totalPages);
    }
  };

  const rightClickMenuList: IconMenuItem[] = [
    {
      icon: <AlarmAddIcon />,
      title: 'Novo Agendamento',
      handleClick: async () => handlePopUpOpen('create'),
    },
  ];

  return (
    <>
      <CreateSchedulingModal
        open={createSchedulingPopUp}
        title="Cadastrar Agendamento"
        handlePopUpClose={() => handlePopUpClose('create')}
        showAlert={showAlert}
      />
      <DeleteSchedulingModal
        open={deleteSchedulingPopUp}
        title="Deletar Agendamento"
        handlePopUpClose={() => handlePopUpClose('delete')}
        showAlert={showAlert}
        idToDelete={selectedId}
        subTitle="Deseja realmente deletar esse agendamento?"
      />
      <EditSchedulingModal
        open={editSchedulingPopUp}
        title="Editar Agendamento"
        handlePopUpClose={() => handlePopUpClose('edit')}
        showAlert={showAlert}
        idToEdit={selectedId}
      />
      <AddPlaylistToSchedulingModal
        open={addPlaylistToSchedulingPopUp}
        title="Adicionar Playlist ao Agendamento"
        handlePopUpClose={() => handlePopUpClose('add-playlist')}
        showAlert={showAlert}
        idScheduling={selectedId}
      />
      <DetailsSchedulingModal
        open={detailsSchedulingPopUp}
        title="Detalhes Agendamento"
        handlePopUpClose={() => handlePopUpClose('details')}
        idToDetails={selectedId}
        showAlert={showAlert}
      />
      <LayoutBase
        title="Listagem Agendamentos"
        iconMenuItemList={rightClickMenuList}
        toolBar={<ToolbarPureTV />}
      >
        <ContainerSimpleList
          search={{
            placeholder: 'Pesquisar por agendamento',
            searchData: searchData,
            createPopUp: () => handlePopUpOpen('create'),
          }}
          totalPage={totalPage}
          handleChange={handleChange}
        >
          <List>
            {listSchedules.length > 0 ? (
              listSchedules.map((scheduling) => (
                <SchedulingItem
                  editScheduling={async () =>
                    handlePopUpOpen('edit', scheduling.id)
                  }
                  deleteScheduling={async () =>
                    handlePopUpOpen('delete', scheduling.id)
                  }
                  addPlaylistToScheduling={async () =>
                    handlePopUpOpen('add-playlist', scheduling.id)
                  }
                  detailsScheduling={async () =>
                    handlePopUpOpen('details', scheduling.id)
                  }
                  key={scheduling.id}
                  scheduling={scheduling}
                />
              ))
            ) : (
              <EmptyListResponse
                message="Sem Agendamentos"
                icon={
                  <EventBusyIcon
                    sx={{
                      fontSize: theme.spacing(10),
                    }}
                  />
                }
              />
            )}
          </List>
        </ContainerSimpleList>
      </LayoutBase>
      {SnackbarAlert}
    </>
  );
};
