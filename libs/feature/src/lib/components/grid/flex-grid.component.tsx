import { Grid } from '@mui/material';
import { FC, ReactNode } from 'react';

interface GridProps {
  children: ReactNode;
}

export const FlexGrid: FC<GridProps> = ({ children }) => {
  return (
    <Grid container justifyContent="center" sx={{ height: '100vh' }}>
      {children}
    </Grid>
  );
};
