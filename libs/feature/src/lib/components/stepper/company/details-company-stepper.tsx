import { Box } from '@mui/material';
import { CompanyAllIdsResponseDto } from '@workspaces/domain';
import { FC, useState } from 'react';
import { FormDetailsCompany } from '../../form';

interface DetailsCompanyStepperProps {
  showAlert: (message: string, success: boolean) => void;
  handlePopUpClose: () => void;
  totalPosition?: number;
  companyIds: CompanyAllIdsResponseDto;
}

export const DetailsCompanyStepper: FC<DetailsCompanyStepperProps> = ({
  showAlert,
  handlePopUpClose,
  totalPosition = 5,
  companyIds,
}) => {
  const [step, setStep] = useState(1);

  const changeStage = (stepPosition: number) => {
    setStep(stepPosition);
  };

  return (
    <Box>
      {step === 1 && (
        <FormDetailsCompany
          companyId={companyIds.companySimpleId}
          handlePopUpClose={() => changeStage(2)}
          showAlert={showAlert}
          step={{
            stepPosition: step,
            totalPositions: totalPosition,
          }}
          buttonRight={() => changeStage(2)}
        />
      )}
    </Box>
  );
};
