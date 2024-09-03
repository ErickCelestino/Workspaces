import { Box } from '@mui/material';
import { FC, useState } from 'react';
import { FormEditCompany } from '../../form';

interface CompanyStepperProps {
  showAlert: (message: string, success: boolean) => void;
  handlePopUpClose: () => void;
  totalPosition?: number;
  companyId: string;
}

export const EditCompanyStepper: FC<CompanyStepperProps> = ({
  handlePopUpClose,
  showAlert,
  companyId,
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
          companyId={companyId}
        />
      )}
    </Box>
  );
};
