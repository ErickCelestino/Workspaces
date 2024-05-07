import { useTheme } from '@mui/material';
import { FormCard } from '../../components';
import { LayoutBase } from '../../layout';

export const EditUserContainer = () => {
  const theme = useTheme();
  return (
    <LayoutBase title="Editar Usuario">
      <FormCard height={theme.spacing(63)} width={theme.spacing(100)}>
        aa
      </FormCard>
    </LayoutBase>
  );
};
