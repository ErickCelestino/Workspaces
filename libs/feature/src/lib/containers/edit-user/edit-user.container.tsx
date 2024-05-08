import { useTheme } from '@mui/material';
import { FormCard, FormEditUser } from '../../components';
import { LayoutBase } from '../../layout';

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
