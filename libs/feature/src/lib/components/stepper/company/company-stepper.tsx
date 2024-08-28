import { FC, useState } from 'react';
import {
  FormCreateCompany,
  FormCreateCompanyData,
  FormConsultCompanyByCnpj,
  FormCreateCompanyAddress,
} from '../../form';
import { Box } from '@mui/material';
import { CompanyResponseDto } from '@workspaces/domain';

interface CompanyStepperProps {
  showAlert: (message: string, success: boolean) => void;
  handlePopUpClose: () => void;
  totalPosition?: number;
}

export const CompanyStepper: FC<CompanyStepperProps> = ({
  showAlert,
  handlePopUpClose,
  totalPosition = 4,
}) => {
  const [step, setStep] = useState(1);
  const [companyId, setCompanyId] = useState('');
  const [companyData, setCompanyData] = useState<CompanyResponseDto>(
    {} as CompanyResponseDto
  );

  const changeStage = (stepPosition: number) => {
    setStep(stepPosition);
  };

  const changeCompany = (company: CompanyResponseDto) => {
    setCompanyData(company);
  };

  const changeCompanyId = (companyId: string) => {
    setCompanyId(companyId);
  };

  return (
    <Box>
      {step === 1 && (
        <FormConsultCompanyByCnpj
          showAlert={showAlert}
          handlePopUpClose={() => changeStage(2)}
          changeCompany={changeCompany}
          step={{
            stepPosition: step,
            totalPositions: totalPosition,
          }}
          totalPosition={totalPosition}
        />
      )}

      {step === 4 && (
        <FormCreateCompany
          showAlert={showAlert}
          handlePopUpClose={() => changeStage(3)}
          changeCompanyId={changeCompanyId}
          step={{
            stepPosition: step,
            totalPositions: totalPosition,
          }}
          totalPosition={totalPosition}
          company={companyData.simple}
        />
      )}

      {step === 3 && (
        <FormCreateCompanyData
          showAlert={showAlert}
          handlePopUpClose={() => changeStage(4)}
          step={{
            stepPosition: step,
            totalPositions: totalPosition,
          }}
          companyId={companyId}
          companyData={companyData.data}
          totalPosition={totalPosition}
        />
      )}

      {step === 2 && (
        <FormCreateCompanyAddress
          showAlert={showAlert}
          handlePopUpClose={handlePopUpClose}
          step={{
            stepPosition: step,
            totalPositions: totalPosition,
          }}
          companyId={companyId}
          companyAddress={companyData.address}
          totalPosition={totalPosition}
        />
      )}
    </Box>
  );
};
