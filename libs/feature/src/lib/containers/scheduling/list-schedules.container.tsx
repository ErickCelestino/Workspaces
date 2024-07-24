import { Icon, List, useMediaQuery, useTheme } from '@mui/material';
import AlarmAddIcon from '@mui/icons-material/AlarmAdd';
import { LayoutBase } from '../../layout';
import {
  AddPlaylistToSchedulingModal,
  CreateSchedulingModal,
  DeleteSchedulingModal,
  EditSchedulingModal,
  MobileButtonMenu,
  RightClickMenu,
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
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const [listSchedules, setListSchedules] = useState<Scheduling[]>([]);
  const [search, setSearch] = useState(false);
  const { showSnackbarAlert, SnackbarAlert } = useSnackbarAlert();
  const [totalPage, setTotalPage] = useState<number>(1);
  const [createSchedulingPopUp, setCreateSchedulingPopUp] = useState(false);
  const [deleteSchedulingPopUp, setDeleteSchedulingPopUp] = useState(false);
  const [editSchedulingPopUp, setEditSchedulingPopUp] = useState(false);
  const [addPlaylistToSchedulingPopUp, setAddPlaylistToSchedulingPopUp] =
    useState(false);
  const [selectedId, setSelectedId] = useState('');

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
    if (!search) {
      handleData({
        filter: '',
        loggedUserId: loggedUser?.id ?? '',
      });
    }
  }, [handleData, loggedUser, search]);

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
    }
  };

  const handlePopUpClose = (types: CrudType | 'add-playlist') => {
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
    }
  };

  const searchData = async (input: string) => {
    setSearch(true);
    const result = await handleData({
      loggedUserId: loggedUser?.id ?? '',
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
    setSearch(true);
    const result = await ListSchedulesRequest({
      loggedUserId: loggedUser?.id ?? '',
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
      <LayoutBase title="Listagem Agendamentos" toolBar={<ToolbarPureTV />}>
        <RightClickMenu iconMenuItemList={rightClickMenuList}>
          {smDown && <MobileButtonMenu iconMenuItemList={rightClickMenuList} />}
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
              {listSchedules.map((scheduling) => (
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
                  key={scheduling.id}
                  scheduling={scheduling}
                />
              ))}
            </List>
          </ContainerSimpleList>
        </RightClickMenu>
      </LayoutBase>
      {SnackbarAlert}
    </>
  );
};
