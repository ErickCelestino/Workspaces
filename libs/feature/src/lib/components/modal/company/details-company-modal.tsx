import { FC, useEffect, useState } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import { SimpleFormModal } from '../simple';
import { useFindAllCompanyIdsData } from '../../../hooks';
import { useLoggedUser } from '../../../contexts';
import { DetailsCompanyStepper } from '../../stepper';

interface DetailsCompanyModalProps {
  open: boolean;
  title: string;
  companyId: string;
  handlePopUpClose: () => void;
  showAlert: (message: string, success: boolean) => void;
}

export const DetailsCompanyModal: FC<DetailsCompanyModalProps> = ({
  open,
  title,
  companyId,
  handlePopUpClose,
  showAlert,
}) => {
  const theme = useTheme();
  const { loggedUser } = useLoggedUser();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const [dataLoaded, setDataLoaded] = useState(false);

  const { companyIds, getCompanyIdsData } = useFindAllCompanyIdsData({
    companyId,
    loggedUserId: loggedUser?.id ?? '',
    showAlert,
  });

  useEffect(() => {
    if (!open) {
      setDataLoaded(false);
    }
  }, [open]);

  useEffect(() => {
    if (open && companyId && !dataLoaded) {
      getCompanyIdsData();
      setDataLoaded(true);
    }
  }, [loggedUser, companyId, dataLoaded, open, getCompanyIdsData]);

  return (
    <SimpleFormModal
      open={open}
      handlePopUpClose={handlePopUpClose}
      height="auto"
      width={smDown ? '90%' : theme.spacing(90)}
      title={title}
    >
      {companyIds && (
        <DetailsCompanyStepper companyIds={companyIds} showAlert={showAlert} />
      )}
    </SimpleFormModal>
  );
};
