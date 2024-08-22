import { FC, useState } from 'react';
import { FormCreateCompany } from '../../form';
import { Box } from '@mui/material';

interface CompanyStepperProps {
  showAlert: (message: string, success: boolean) => void;
  handlePopUpClose: () => void;
  totalPosition?: number;
}

export const CompanyStepper: FC<CompanyStepperProps> = ({
  showAlert,
  handlePopUpClose,
  totalPosition = 3,
}) => {
  const [step, setStep] = useState(1);

  const changeStage = (stepPosition: number) => {
    setStep(stepPosition);
  };

  return (
    <Box>
      <FormCreateCompany
        showAlert={showAlert}
        handlePopUpClose={() => changeStage(1)}
        step={{
          stepPosition: step,
          totalPositions: totalPosition,
        }}
      />
    </Box>
  );
};
