import { Box, Card, Typography, useMediaQuery, useTheme } from '@mui/material';
import { FC, ReactNode } from 'react';

interface CardFormProps {
  children: ReactNode;
  title: string;
}

export const CardForm: FC<CardFormProps> = ({ children, title }) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const mdDown = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      height="90vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {!smDown && (
        <Card
          sx={{
            textAlign: 'center',
            width: mdDown ? theme.spacing(60) : theme.spacing(120),
            height: theme.spacing(100),
          }}
        >
          <Typography
            variant={mdDown ? 'h5' : 'h3'}
            sx={{
              margin: theme.spacing(3),
            }}
          >
            {title}
          </Typography>
          {children}
        </Card>
      )}

      {smDown && <Box>{children}</Box>}
    </Box>
  );
};
