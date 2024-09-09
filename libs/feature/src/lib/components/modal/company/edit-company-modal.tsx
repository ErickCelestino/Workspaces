import { FC, useCallback, useEffect, useState } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import { SimpleFormModal } from '../simple';
import { EditCompanyStepper } from '../../stepper/company/edit-company-stepper';
import {
  CompanyAllIdsResponseDto,
  ErrorResponse,
  FindAllCompanyIdsDto,
} from '@workspaces/domain';
import { FindAllCompanyIdsRequest } from '../../../services';
import axios, { AxiosError } from 'axios';
import { ValidationsError } from '../../../shared';
import { useLoggedUser } from '../../../contexts';

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
  const { loggedUser } = useLoggedUser();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const [dataLoaded, setDataLoaded] = useState(false);
  const [allCompanyIds, setAllCompanyIds] = useState<CompanyAllIdsResponseDto>(
    {} as CompanyAllIdsResponseDto
  );

  useEffect(() => {
    if (!open) {
      setDataLoaded(false);
    }
  }, [open]);

  const getAllCopanyIds = useCallback(
    async (input: FindAllCompanyIdsDto) => {
      try {
        const result = await FindAllCompanyIdsRequest(input);
        setDataLoaded(true);
        setAllCompanyIds(result);
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ErrorResponse>;
          const errors = ValidationsError(axiosError, 'Company IDS');
          if (errors) {
            showAlert(errors, false);
          }
        }
      }
    },
    [showAlert]
  );

  useEffect(() => {
    if (open && companyId && !dataLoaded) {
      const loggedUserId = loggedUser?.id ?? '';

      getAllCopanyIds({
        companyId,
        loggedUserId: loggedUserId,
      });
    }
  }, [loggedUser, companyId, dataLoaded, open, getAllCopanyIds]);

  return (
    <SimpleFormModal
      open={open}
      handlePopUpClose={handlePopUpClose}
      height="auto"
      width={smDown ? '90%' : theme.spacing(90)}
      title={title}
    >
      <EditCompanyStepper
        companyIds={allCompanyIds}
        handlePopUpClose={handlePopUpClose}
        showAlert={showAlert}
      />
    </SimpleFormModal>
  );
};
