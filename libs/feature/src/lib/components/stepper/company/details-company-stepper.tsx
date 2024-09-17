import { Box } from '@mui/material';
import { CompanyAllIdsResponseDto } from '@workspaces/domain';
import { FC, useState } from 'react';
import { FormDetailsCompanyFinal, FormDetailsCompanyInitial } from '../../form';

interface DetailsCompanyStepperProps {
  showAlert: (message: string, success: boolean) => void;
  handlePopUpClose: () => void;
  totalPosition?: number;
  companyIds: CompanyAllIdsResponseDto;
}

export const DetailsCompanyStepper: FC<DetailsCompanyStepperProps> = ({
  showAlert,
  handlePopUpClose,
  totalPosition = 2,
  companyIds,
}) => {
  const [step, setStep] = useState(1);

  const changeStage = (stepPosition: number) => {
    setStep(stepPosition);
  };

  return (
    <Box>
      {step === 1 && (
        <FormDetailsCompanyInitial
          companySimpleId={companyIds.companySimpleId}
          companyDataId={companyIds.companyDataId}
          showAlert={showAlert}
          step={{
            stepPosition: step,
            totalPositions: totalPosition,
          }}
          buttonRight={() => changeStage(2)}
        />
      )}

      {step === 2 && (
        <FormDetailsCompanyFinal
          companyAddressId={companyIds.companyAddressId}
          companyResponsibleId={companyIds.companyResponsibleId}
          buttonLeft={() => changeStage(1)}
          showAlert={showAlert}
          step={{
            stepPosition: step,
            totalPositions: totalPosition,
          }}
        />
      )}
    </Box>
  );
};
