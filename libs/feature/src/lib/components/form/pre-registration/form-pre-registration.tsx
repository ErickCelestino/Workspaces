import { Box, Button, TextField } from '@mui/material';
import { FC } from 'react';

interface FormPreRegistrationProps {
  name: string;
  companyName: string;
}

export const FormPreRegistration: FC<FormPreRegistrationProps> = ({
  name,
  companyName,
}) => {
  return (
    <Box component="form" noValidate autoComplete="off">
      <TextField
        label={name}
        id={name}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <TextField
        label={companyName}
        id={companyName}
        variant="outlined"
        fullWidth
        margin="normal"
      />

      <Button variant="contained" color="primary" fullWidth>
        Enviar
      </Button>
    </Box>
  );
};
