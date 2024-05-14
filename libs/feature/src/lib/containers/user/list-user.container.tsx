import { Box, Divider } from '@mui/material';
import { ListUser } from '../../components';
import { LayoutBase } from '../../layout';
import { useEffect, useState } from 'react';
import { ListUserRequest } from '../../services';
import { UserList } from '@workspaces/domain';

export const ListUserContainer = () => {
  const [data, setData] = useState<UserList[]>([]);
  useEffect(() => {
    const getData = async () => {
      const result = await ListUserRequest('');
      console.log(result);
    };
    getData();
  }, []);

  return (
    <LayoutBase title="Listagem de Usuários">
      <Box width="100%" display="flex" justifyContent="center">
        <Box width="80%">
          <ListUser image="teste" imageAlt="imagem de teste" name="aa" />
        </Box>
      </Box>
    </LayoutBase>
  );
};
