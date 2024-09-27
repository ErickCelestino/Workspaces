import { Box, Typography } from '@mui/material';
import { FC } from 'react';

interface UnauthorizedUserContainerProps {
  title?: string;
  subTitle?: string;
}

export const UnauthorizedUserContainer: FC<UnauthorizedUserContainerProps> = ({
  title = 'Você não está autorizado a acessar a aplicação',
  subTitle = 'Por favor entre em contato com seu supervisor ou gerente para que o mesmo libere o seu acesso à aplicação',
}) => {
  return (
    <Box
      sx={(theme) => ({
        zIndex: theme.zIndex.modal + 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '80vh',
        textAlign: 'center',
      })}
    >
      <img
        width="300rem"
        height="300rem"
        src="/assets/images/Unauthorized-Access.png"
        alt="Unauthorized Access"
      />
      <Typography variant="h2" sx={{ marginTop: 2 }}>
        {title}
      </Typography>
      <Typography variant="body1" sx={{ marginTop: 1 }}>
        {subTitle}
      </Typography>
    </Box>
  );
};
