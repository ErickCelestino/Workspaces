import {
  ComboBoxListResult,
  ErrorResponse,
  StepItem,
} from '@workspaces/domain';
import { useLoggedUser } from '../../../../contexts';
import { FC, useState } from 'react';
import { useListCompanyData } from '../../../../hooks';
import { Box, Button, useTheme } from '@mui/material';
import { SearchComboBox } from '../../../combo-box';
import { SelectCompanyRequest } from 'libs/feature/src/lib/services';
import axios, { AxiosError } from 'axios';
import { ValidationsError } from 'libs/feature/src/lib/shared';

interface FormSelectCompanyProps {
  showAlert: (message: string, success: boolean) => void;
  handlePopUpClose: () => void;
  buttonTitle?: string;
}

export const FormSelectCompany: FC<FormSelectCompanyProps> = ({
  showAlert,
  handlePopUpClose,
  buttonTitle = 'Selecionar Empresa',
}) => {
  const { loggedUser } = useLoggedUser();
  const theme = useTheme();

  const [comboBoxListResult, setComboBoxListResult] =
    useState<ComboBoxListResult | null>(null);

  const { getListCompanyData, listCompany } = useListCompanyData({
    showAlert,
    loggedUserId: loggedUser?.id ?? '',
  });

  const handleList = async (
    searchTerm: string,
    page: number,
    pageSize: number
  ) => {
    await getListCompanyData(searchTerm ?? '', page);

    return (
      listCompany.map((company) => {
        return {
          id: company.id,
          key: company.socialReason,
        };
      }) ?? []
    );
  };

  const getResult = (item: ComboBoxListResult | null) => {
    setComboBoxListResult(item);
  };

  const selectCompany = async () => {
    try {
      const result = await SelectCompanyRequest({
        companyId: comboBoxListResult?.id ?? '',
        loggedUserId: loggedUser?.id ?? '',
      });

      if (result) {
        showAlert('Agendamentos movidos com sucesso', true);
        handlePopUpClose();
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        const errors = ValidationsError(axiosError, 'Selecionar Empresa');
        if (errors) {
          showAlert(errors, false);
        }
      }
    }
  };

  return (
    <>
      <Box>
        <SearchComboBox
          onList={handleList}
          onItemSelected={getResult}
          pageSize={6}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: theme.spacing(2),
        }}
      >
        <Button variant="contained" onClick={selectCompany}>
          {buttonTitle}
        </Button>
      </Box>
    </>
  );
};
