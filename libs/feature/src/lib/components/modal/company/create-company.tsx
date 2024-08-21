import { FC } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import { SimpleFormModal } from '../simple';
import { FormCreateCompany } from '../../form';

interface CreateCompanyModalProps {
  open: boolean;
  title: string;
  handlePopUpClose: () => void;
  showAlert: (message: string, success: boolean) => void;
  fantasyNameLabel?: string;
  cnpjLabel?: string;
  socialReasonLabel?: string;
  successMessage?: string;
}

export const CreateCompanyModal: FC<CreateCompanyModalProps> = ({
  open,
  title,
  handlePopUpClose,
  showAlert,
  fantasyNameLabel = 'Nome Fantasia',
  cnpjLabel = 'CNPJ',
  socialReasonLabel = 'Razão Social',
  successMessage = 'Empresa criada com sucesso',
}) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <SimpleFormModal
      open={open}
      handlePopUpClose={handlePopUpClose}
      height={theme.spacing(70)}
      width={smDown ? '90%' : theme.spacing(90)}
      title={title}
    >
      <FormCreateCompany
        handlePopUpClose={handlePopUpClose}
        showAlert={showAlert}
        fantasyNameLabel={fantasyNameLabel}
        cnpjLabel={cnpjLabel}
        socialReasonLabel={socialReasonLabel}
        successMessage={successMessage}
      />
    </SimpleFormModal>
  );
};
