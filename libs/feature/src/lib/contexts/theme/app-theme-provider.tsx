import { Box, ThemeProvider } from '@mui/material';
import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import { ThemeContext } from './theme-context';
import { ThemeName } from '../../types';
import { LighTheme, DarkTheme } from '../../themes';

interface AppThemeProviderProps {
  children: ReactNode;
}

export const AppThemeProvider: React.FC<AppThemeProviderProps> = ({
  children,
}) => {
  const [themeName, setThemeName] = useState<ThemeName>('light');

  const toggleTheme = useCallback(() => {
    setThemeName((oldThemeName) =>
      oldThemeName === 'light' ? 'dark' : 'light'
    );
  }, []);

  const theme = useMemo(() => {
    if (themeName === 'light') return LighTheme;

    return DarkTheme;
  }, [themeName]);

  return (
    <ThemeContext.Provider value={{ themeName, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <Box
          width="100vw"
          height="100vh"
          bgcolor={theme.palette.background.default}
        >
          {children}
        </Box>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
