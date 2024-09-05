import { Box } from '@mui/material';
import { FC, useState } from 'react';
import {
  FormEditCompany,
  FormEditCompanyAddress,
  FormEditCompanyData,
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
  totalPosition = 5,
}) => {
  const [step, setStep] = useState(1);

  const changeStage = (stepPosition: number) => {
    setStep(stepPosition);
  };

  return (
    <Box>
      {step === 2 && (
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

      {step === 3 && (
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

      {step === 1 && (
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
    </Box>
  );
};
