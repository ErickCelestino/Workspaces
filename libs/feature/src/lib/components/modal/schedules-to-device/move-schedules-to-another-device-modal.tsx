import { FC, useCallback, useState } from 'react';
import { Box, Button, useMediaQuery, useTheme } from '@mui/material';
import {
  ComboBoxListResult,
  ErrorResponse,
  ListDeviceDto,
} from '@workspaces/domain';
import {
  ListDeviceRequest,
  MoveSchedulesToAnotherDeviceRequest,
} from '../../../services';
import axios, { AxiosError } from 'axios';
import { ValidationsError } from '../../../shared';
import { SimpleFormModal } from '../simple';
import { SearchComboBox } from '../../combo-box';

interface MoveSchedulesToAnotherDeviceModalProps {
  selectedSchedules: string[];
  oldDeviceId: string;
  open: boolean;
  onClose: () => void;
  title: string;
  showAlert: (message: string, success: boolean) => void;
  buttonTitle?: string;
  loggedUserId: string;
  companyId: string;
}

export const MoveSchedulesToAnotherDeviceModal: FC<
  MoveSchedulesToAnotherDeviceModalProps
> = ({
  selectedSchedules,
  oldDeviceId,
  companyId,
  onClose,
  open,
  title,
  showAlert,
  buttonTitle = 'Mover Agendamentos',
  loggedUserId,
}) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const [comboBoxListResult, setComboBoxListResult] =
    useState<ComboBoxListResult | null>(null);

  const handleData = useCallback(
    async (data: ListDeviceDto) => {
      try {
        const result = await ListDeviceRequest({
          companyId: data.companyId,
          loggedUserId: data.loggedUserId,
          filter: data.filter,
          skip: data.skip,
          take: data.take,
        });
        return result;
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ErrorResponse>;
          const errors = ValidationsError(axiosError, 'Agendamentos');
          if (errors) {
            showAlert(errors, false);
          }
        }
      }
    },
    [showAlert]
  );

  const searchData = async (input: string) => {
    await handleData({
      companyId: companyId,
      loggedUserId: loggedUserId,
      filter: input,
      skip: 0,
      take: 6,
    });
  };

  const handleList = async (
    searchTerm: string,
    page: number,
    pageSize: number
  ) => {
    const result = await handleData({
      companyId: companyId,
      filter: searchTerm,
      loggedUserId: loggedUserId,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return (
      result?.devices.map((device) => {
        return {
          id: device.id,
          key: device.name,
        };
      }) ?? []
    );
  };

  const getResult = (item: ComboBoxListResult | null) => {
    setComboBoxListResult(item);
  };

  const moveSchedules = async () => {
    try {
      await MoveSchedulesToAnotherDeviceRequest({
        schedulesIds: selectedSchedules,
        loggedUserId: loggedUserId,
        oldDeviceId: oldDeviceId,
        newDeviceId: comboBoxListResult?.id ?? '',
      });

      showAlert('Agendamentos movidos com sucesso', true);
      onClose();
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        const errors = ValidationsError(axiosError, 'Agendamentos');
        if (errors) {
          showAlert(errors, false);
        }
      }
    }
  };

  return (
    <SimpleFormModal
      height={smDown ? theme.spacing(55) : theme.spacing(36)}
      width={smDown ? '90%' : theme.spacing(80)}
      open={open}
      handlePopUpClose={onClose}
      title={title}
    >
      <Box>
        <SearchComboBox
          onSearch={searchData}
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
        <Button variant="contained" onClick={moveSchedules}>
          {buttonTitle}
        </Button>
      </Box>
    </SimpleFormModal>
  );
};
