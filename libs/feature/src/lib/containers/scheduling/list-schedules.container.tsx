import { Box, List } from '@mui/material';
import { LayoutBase } from '../../layout';
import {
  CreateSchedulingModal,
  SchedulingItem,
  ToolbarPureTV,
} from '../../components';
import { ContainerSimpleList } from '../utils';
import { useCallback, useEffect, useState } from 'react';
import {
  CrudType,
  ErrorResponse,
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
  const [listSchedules, setListSchedules] = useState<Scheduling[]>([]);
  const [search, setSearch] = useState(false);
  const { showSnackbarAlert, SnackbarAlert } = useSnackbarAlert();
  const [totalPage, setTotalPage] = useState<number>(1);
  const [createSchedulingPopUp, setCreateSchedulingPopUp] = useState(false);

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

  const handlePopUpOpen = (types: CrudType, id?: string) => {
    switch (types) {
      case 'create':
        setCreateSchedulingPopUp(true);
        break;
      case 'edit':
        // More Implementation
        break;
      case 'delete':
        // More Implementation
        break;
    }
  };

  const handlePopUpClose = (types: CrudType) => {
    switch (types) {
      case 'create':
        setCreateSchedulingPopUp(false);
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

  return (
    <>
      <CreateSchedulingModal
        open={createSchedulingPopUp}
        title="Cadastrar Agendamento"
        handlePopUpClose={() => handlePopUpClose('create')}
        showAlert={showAlert}
      />
      <LayoutBase title="Listagem Agendamentos" toolBar={<ToolbarPureTV />}>
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
                key={scheduling.id}
                scheduling={scheduling}
              />
            ))}
          </List>
        </ContainerSimpleList>
      </LayoutBase>
      {SnackbarAlert}
    </>
  );
};
