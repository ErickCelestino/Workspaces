import { FC, useState } from 'react';
import { FormCreateCompany, FormCreateCompanyData } from '../../form';
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
  const [companyId, setCompanyId] = useState('');

  const changeStage = (stepPosition: number) => {
    setStep(stepPosition);
  };

  const changeCompanyId = (companyId: string) => {
    setCompanyId(companyId);
  };

  return (
    <Box>
      {step === 1 && (
        <FormCreateCompany
          showAlert={showAlert}
          handlePopUpClose={() => changeStage(2)}
          changeCompanyId={changeCompanyId}
          step={{
            stepPosition: step,
            totalPositions: totalPosition,
          }}
        />
      )}
      {step === 2 && (
        <FormCreateCompanyData
          showAlert={showAlert}
          handlePopUpClose={() => changeStage(3)}
          step={{
            stepPosition: step,
            totalPositions: totalPosition,
          }}
          companyId={companyId}
        />
      )}
    </Box>
  );
};
