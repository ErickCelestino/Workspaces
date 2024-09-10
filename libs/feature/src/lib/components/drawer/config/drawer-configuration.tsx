import {
  Box,
  Button,
  Icon,
  MenuItem,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { FC, useCallback, useEffect, useState } from 'react';
import { ListCompanyRequest, removeItemLocalStorage } from '../../../services';
import { useAppThemeContext, useLoggedUser } from '../../../contexts';
import {
  CompanySimpleResponseDto,
  ErrorResponse,
  ListCompanyDto,
  LoggedUser,
} from '@workspaces/domain';
import axios, { AxiosError } from 'axios';
import { ValidationsError } from '../../../shared';

interface DrawerConfigurationProps {
  logoutTitle: string;
  themeTitle: string;
  companyLabel?: string;
  showAlert: (message: string, success: boolean) => void;
}

export const DrawerConfiguration: FC<DrawerConfigurationProps> = ({
  logoutTitle,
  themeTitle,
  companyLabel = 'Alterar Empresa',
  showAlert,
}) => {
  const theme = useTheme();
  const { toggleTheme } = useAppThemeContext();
  const { loggedUser, setLoggedUser } = useLoggedUser();
  const [selectedCompany, setSelectedCompany] = useState('');
  const [dataLoaded, setDataLoaded] = useState(false);

  const logout = () => {
    removeItemLocalStorage('u');
    window.location.reload();
  };

  useEffect(() => {
    if (!loggedUser?.id) {
      setDataLoaded(false);
    }
  }, [loggedUser]);

  useEffect(() => {
    if (loggedUser?.id && !dataLoaded) {
      handleData({
        loggedUserId: loggedUser?.id ?? '',
        filter: '',
      }).then(() => {
        setSelectedCompany(loggedUser?.selectedCompany.id ?? '');
        setDataLoaded(true);
      });
    }
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filteredCompany: CompanySimpleResponseDto =
      loggedUser?.companies.filter(
        (item) => item.id === event.target.value
      )[0] ?? ({} as CompanySimpleResponseDto);
    setSelectedCompany(event.target.value);
    setLoggedUser({
      ...(loggedUser ?? ({} as LoggedUser)),
      selectedCompany: filteredCompany,
    });
  };

  const handleData = useCallback(
    async (data: ListCompanyDto) => {
      try {
        const result = await ListCompanyRequest({
          loggedUserId: data.loggedUserId,
          filter: data.filter,
          skip: data.skip,
          take: data.take,
        });
        if (result) {
          setLoggedUser({
            ...(loggedUser ?? ({} as LoggedUser)),
            companies: result?.companies ?? ([] as CompanySimpleResponseDto[]),
          });
        }
        return result;
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ErrorResponse>;
          const errors = ValidationsError(axiosError, 'Empresa');
          if (errors) {
            showAlert(errors, false);
          }
        }
      }
    },
    [loggedUser, setLoggedUser, showAlert]
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(2),
      }}
    >
      <TextField
        fullWidth
        select
        value={selectedCompany}
        margin="normal"
        id="companyId"
        label={companyLabel}
        onChange={handleChange}
      >
        {loggedUser?.companies.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.socialReason}
          </MenuItem>
        ))}
      </TextField>
      <Button
        onClick={logout}
        color="inherit"
        sx={{
          marginBottom: theme.spacing(0.5),
        }}
        startIcon={<Icon>logout</Icon>}
      >
        <Typography>{logoutTitle}</Typography>
      </Button>

      <Button
        onClick={toggleTheme}
        color="inherit"
        startIcon={<Icon>dark_mode</Icon>}
      >
        <Typography>{themeTitle}</Typography>
      </Button>
    </Box>
  );
};
