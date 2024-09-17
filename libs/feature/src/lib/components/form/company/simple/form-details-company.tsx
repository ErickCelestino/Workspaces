import { Box, Typography } from '@mui/material';
import { StepItem } from '@workspaces/domain';
import { FC, useEffect, useState } from 'react';
import { useLoggedUser } from '../../../../contexts';
import { useFindSimpleCompanyByIdData } from '../../../../hooks';

interface FormDetailsCompanyProps {
  showAlert: (message: string, success: boolean) => void;
  handlePopUpClose: () => void;
  buttonRight: () => void;
  companyId: string;
  step: StepItem;
  companyIdTitle?: string;
}

export const FormDetailsCompany: FC<FormDetailsCompanyProps> = ({
  showAlert,
  handlePopUpClose,
  buttonRight,
  companyId,
  companyIdTitle = 'ID',
  step: { stepPosition = 1, stepTitle = 'Etapa' },
}) => {
  const { loggedUser } = useLoggedUser();

  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (Object.keys(companyId ?? '').length < 1) {
      setDataLoaded(false);
    }
  }, [companyId]);

  const { companyById, getListCompanyData } = useFindSimpleCompanyByIdData({
    companyId,
    loggedUserId: loggedUser?.id ?? '',
    showAlert,
  });

  useEffect(() => {
    if (companyId && !dataLoaded) {
      getListCompanyData();
    }
  }, [loggedUser, companyId, dataLoaded, getListCompanyData]);

  return (
    <Box sx={{ mt: 2 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          sx={{
            fontSize: '18px',
          }}
        >
          <strong>{companyIdTitle}: </strong>
          {companyById.id ?? ''}
        </Typography>
      </Box>
    </Box>
  );
};
