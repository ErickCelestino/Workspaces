import { zodResolver } from '@hookform/resolvers/zod';
import { Box, TextField } from '@mui/material';
import { EditUserDto } from '@workspaces/domain';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CreateUserSchema } from '../../shared';

export const FormEditUser = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<EditUserDto>({
    mode: 'all',
    criteriaMode: 'all',
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      name: '',
    },
  });

  return (
    <Box width="80%">
      <TextField fullWidth />
    </Box>
  );
};
