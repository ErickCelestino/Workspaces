import { Box } from '@mui/material';
import { LayoutBase } from '../../layout';
import { CreateSchedulingModal, ToolbarPureTV } from '../../components';
import { ContainerSimpleList } from '../utils';
import { useCallback, useEffect, useState } from 'react';
import { CrudType } from '@workspaces/domain';
import { useSnackbarAlert } from '../../hooks';

export const ListSchedulingContainer = () => {
  const [search, setSearch] = useState(false);
  const { showSnackbarAlert, SnackbarAlert } = useSnackbarAlert();
  const [totalPage, setTotalPage] = useState<number>(1);
  const [createSchedulingPopUp, setCreateSchedulingPopUp] = useState(false);

  useEffect(() => {
    if (!search) {
      // More Implementation
    }
  }, [search]);

  const showAlert = useCallback(
    (message: string, success: boolean) => {
      showSnackbarAlert({
        message: message,
        severity: success ? 'success' : 'error',
      });
    },
    [showSnackbarAlert]
  );

  const handlePopUpOpen = (types: CrudType, id?: string) => {
    switch (types) {
      case 'create':
        setCreateSchedulingPopUp(true);
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
    // More Implementation
  };

  const handleChange = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setSearch(true);
    // More Implementation
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
          <Box>tes</Box>
        </ContainerSimpleList>
      </LayoutBase>
      {SnackbarAlert}
    </>
  );
};
