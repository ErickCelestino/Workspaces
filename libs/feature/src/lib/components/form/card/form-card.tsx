import { Box, Card } from '@mui/material';
import { FC, ReactNode } from 'react';

interface CreateCardProps {
  children: ReactNode;
  height: string;
  width: string;
}

export const FormCard: FC<CreateCardProps> = ({ children, height, width }) => {
  return (
    <Box width="100%" height="100%" display="flex" justifyContent="center">
      <Card
        sx={{
          height: height,
          width: width,
        }}
      >
        {children}
      </Card>
    </Box>
  );
};
