import { Box } from '@mui/material';
import { FC, useState } from 'react';
import {
  FormEditCompany,
  FormEditCompanyAddress,
  FormEditCompanyData,
  FormEditCompanyResponsible,
} from '../../form';
import { CompanyAllIdsResponseDto } from '@workspaces/domain';

interface CompanyStepperProps {
  showAlert: (message: string, success: boolean) => void;
  handlePopUpClose: () => void;
  totalPosition?: number;
  companyIds: CompanyAllIdsResponseDto;
}

export const EditCompanyStepper: FC<CompanyStepperProps> = ({
  handlePopUpClose,
  showAlert,
  companyIds,
  totalPosition = 4,
}) => {
  const [step, setStep] = useState(1);

  const changeStage = (stepPosition: number) => {
    setStep(stepPosition);
  };

  return (
    <Box>
      {step === 1 && (
        <FormEditCompany
          showAlert={showAlert}
          handlePopUpClose={() => changeStage(2)}
          step={{
            stepPosition: step,
            totalPositions: totalPosition,
          }}
          totalPosition={totalPosition}
          companyId={companyIds.companySimpleId}
        />
      )}

      {step === 2 && (
        <FormEditCompanyData
          companyDataId={companyIds.companyDataId}
          showAlert={showAlert}
          handlePopUpClose={() => changeStage(3)}
          step={{
            stepPosition: step,
            totalPositions: totalPosition,
          }}
          totalPosition={totalPosition}
        />
      )}

      {step === 3 && (
        <FormEditCompanyAddress
          companyAddressId={companyIds.companyAddressId}
          handlePopUpClose={() => changeStage(4)}
          showAlert={showAlert}
          step={{
            stepPosition: step,
            totalPositions: totalPosition,
          }}
          totalPosition={totalPosition}
        />
      )}

      {step === 4 && (
        <FormEditCompanyResponsible
          companyResponsibleId={companyIds.companyResponsibleId}
          showAlert={showAlert}
          handlePopUpClose={handlePopUpClose}
          step={{
            stepPosition: step,
            totalPositions: totalPosition,
          }}
        />
      )}
    </Box>
  );
};
