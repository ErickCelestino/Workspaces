import { FC } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import { SimpleFormModal } from '../simple';
import { EditCompanyStepper } from '../../stepper/company/edit-company-stepper';

interface EditCompanyModalProps {
  open: boolean;
  title: string;
  companyId: string;
  handlePopUpClose: () => void;
  showAlert: (message: string, success: boolean) => void;
}

export const EditCompanyModal: FC<EditCompanyModalProps> = ({
  open,
  title,
  companyId,
  handlePopUpClose,
  showAlert,
}) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <SimpleFormModal
      open={open}
      handlePopUpClose={handlePopUpClose}
      height="auto"
      width={smDown ? '90%' : theme.spacing(90)}
      title={title}
    >
      <EditCompanyStepper
        companyId={companyId}
        handlePopUpClose={handlePopUpClose}
        showAlert={showAlert}
      />
    </SimpleFormModal>
  );
};
