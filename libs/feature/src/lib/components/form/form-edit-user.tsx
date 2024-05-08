import { zodResolver } from '@hookform/resolvers/zod';
import { Box, TextField } from '@mui/material';
import { EditUserDto } from '@workspaces/domain';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CreateUserSchema } from '../../shared';

interface FormEditUserProps {
  nameLabel: string;
  birthDateLabel: string;
}

export const FormEditUser: FC<FormEditUserProps> = ({
  nameLabel,
  birthDateLabel,
}) => {
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
      id: '',
      name: '',
      birthDate: new Date(),
    },
  });

  return (
    <Box width="80%">
      <TextField
        margin="normal"
        required
        disabled={true}
        error={!!errors.id}
        helperText={errors.id?.message}
        id="id"
        label="id"
        {...register('id')}
        autoComplete="id"
      />
      <TextField
        margin="normal"
        required
        disabled={loading}
        fullWidth
        error={!!errors.name}
        helperText={errors.name?.message}
        id="name"
        label={nameLabel}
        {...register('name')}
        autoComplete="name"
      />
      <TextField
        margin="normal"
        type="date"
        disabled={loading}
        error={!!errors.birthDate}
        helperText={errors.birthDate?.message}
        InputLabelProps={{ shrink: true, required: true }}
        label={birthDateLabel}
        id="birthDate"
        fullWidth
        {...register('birthDate')}
      />
    </Box>
  );
};
