import { Card } from '@mui/material';
import { FC, ReactNode } from 'react';
import { FlexGrid } from '../grid';

interface FormAuthCardProps {
  imageUrl: string;
  children: ReactNode;
}

export const FormAuthCard: FC<FormAuthCardProps> = ({
  imageUrl = '',
  children,
}) => {
  return (
    <FlexGrid>
      <Card
        sx={{
          textAlign: 'center',
          height: 635,
          width: 1070,
          flexDirection: 'row',
          marginTop: '8rem',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <img
          src={imageUrl}
          alt="auth"
          style={{ maxWidth: '50%', height: '100%', flex: '0 0 50%' }}
        />
        <div style={{ flex: '0 0 50%' }}>{children}</div>
      </Card>
    </FlexGrid>
  );
};
