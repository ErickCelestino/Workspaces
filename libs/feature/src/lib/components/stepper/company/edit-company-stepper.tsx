import { Box } from '@mui/material';
import { FC, useState } from 'react';
import { FormEditCompany, FormEditCompanyData } from '../../form';
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
  totalPosition = 5,
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
          handlePopUpClose={handlePopUpClose}
          step={{
            stepPosition: step,
            totalPositions: totalPosition,
          }}
          totalPosition={totalPosition}
        />
      )}
    </Box>
  );
};
