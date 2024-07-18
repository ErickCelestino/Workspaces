import { Box } from '@mui/material';
import { LayoutBase } from '../../layout';
import { ToolbarPureTV } from '../../components';
import { ContainerSimpleList } from '../utils';
import { useEffect, useState } from 'react';
import { CrudType } from '@workspaces/domain';

export const ListSchedulingContainer = () => {
  const [search, setSearch] = useState(false);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [createSchedulingPopUp, setCreateSchedulingPopUp] = useState(false);

  useEffect(() => {
    if (!search) {
      // More Implementation
    }
  }, [search]);

  const handlePopUpOpen = (types: CrudType, id?: string) => {
    switch (types) {
      case 'create':
        setCreateSchedulingPopUp(true);
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
  );
};
