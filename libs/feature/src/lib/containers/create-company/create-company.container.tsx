import { Box, useTheme } from '@mui/material';
import { CardForm, FormCreateCompany } from '../../components';
import { LayoutBase } from '../../layout';
import { useSnackbarAlert } from '../../hooks';

export const CreateCompanyContainer = () => {
  const { showSnackbarAlert, SnackbarAlert } = useSnackbarAlert();
  const showErrorAlert = (message: string) => {
    showSnackbarAlert({
      message: message,
      severity: 'error',
    });
  };

  return (
    <>
      <LayoutBase title="Criar Empresa">
        <CardForm title="Adicionar Empresa">
          <FormCreateCompany showAlert={showErrorAlert} />
        </CardForm>
      </LayoutBase>
      {SnackbarAlert}
    </>
  );
};
