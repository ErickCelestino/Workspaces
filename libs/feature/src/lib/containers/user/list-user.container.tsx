import { Box, Divider } from '@mui/material';
import { ListUser } from '../../components';
import { LayoutBase } from '../../layout';

export const ListUserContainer = () => {
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
