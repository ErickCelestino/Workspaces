import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, TextField, useTheme } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { DeleteUserSchema } from '../../../shared';

export const FormDeleteUser = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const theme = useTheme();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<{ description: string }>({
    mode: 'all',
    criteriaMode: 'all',
    resolver: zodResolver(DeleteUserSchema),
    defaultValues: {
      description: '',
    },
  });
  return (
    <Box
      component="form"
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <TextField
          sx={{
            width: theme.spacing(40),
          }}
          margin="normal"
          fullWidth
          error={!!errors.description}
          helperText={errors.description?.message}
          id="description"
          label="Descrição"
          {...register('description')}
          autoComplete="description"
        />
        <Box>
          <Button
            sx={{
              marginRight: theme.spacing(2),
            }}
            color="error"
            variant="contained"
          >
            Não
          </Button>
          <Button color="success" variant="contained">
            Sim
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
