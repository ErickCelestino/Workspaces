import { useTheme } from '@mui/material';
import { FormCard, FormEditUser } from '../../components';
import { LayoutBase } from '../../layout';
import { useEffect, useState } from 'react';
import { UserList } from '@workspaces/domain';
import { FindUserRequest, getItemLocalStorage } from '../../services';

export const EditUserContainer = () => {
  const theme = useTheme();

  return (
    <LayoutBase title="Editar Usuario">
      <FormCard
        title="Editar os dados do Usuario"
        height={theme.spacing(63)}
        width={theme.spacing(100)}
      >
        <FormEditUser
          nameLabel="Digite o nome"
          birthDateLabel="Digite sua Data de Nascimento"
        />
      </FormCard>
    </LayoutBase>
  );
};
