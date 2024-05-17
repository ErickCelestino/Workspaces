import { useTheme } from '@mui/material';
import { FormCard, FormEditUser } from '../../components';
import { LayoutBase } from '../../layout';
import { useSnackbarAlert } from '../../hooks';

export const EditUserContainer = () => {
  const { showSnackbarAlert, SnackbarAlert } = useSnackbarAlert();
  const theme = useTheme();

  const showErrorAlert = (message: string) => {
    showSnackbarAlert({
      message: message,
      severity: 'error',
    });
  };

  return (
    <>
      <LayoutBase title="Editar Usuario">
        <FormCard
          title="Editar os dados do Usuario"
          height={theme.spacing(63)}
          width={theme.spacing(100)}
        >
          <FormEditUser
            showAlert={showErrorAlert}
            nameLabel="Digite o nome"
            birthDateLabel="Digite sua Data de Nascimento"
          />
        </FormCard>
      </LayoutBase>
      {SnackbarAlert}
    </>
  );
};
