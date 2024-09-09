import { Box, Button, Icon, Typography, useTheme } from '@mui/material';
import { FC } from 'react';
import { removeItemLocalStorage } from '../../../services';
import { useAppThemeContext } from '../../../contexts';

interface DrawerConfigurationProps {
  logoutTitle: string;
  themeTitle: string;
}

export const DrawerConfiguration: FC<DrawerConfigurationProps> = ({
  logoutTitle,
  themeTitle,
}) => {
  const theme = useTheme();
  const { toggleTheme } = useAppThemeContext();

  const logout = () => {
    removeItemLocalStorage('u');
    window.location.reload();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(2),
      }}
    >
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
