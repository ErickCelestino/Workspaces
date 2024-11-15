import { Box, TextField, Typography, useTheme } from '@mui/material';
import { FC } from 'react';

interface CustomInputProps {
  label: string;
  color?: {
    textColor?: string;
    labelColor?: string;
    backgroundInputColor?: string;
  };
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  fontSize?: number;
}

export const CustomInput: FC<CustomInputProps> = ({
  label,
  color,
  onChange,
  value,
  fontSize = 1.8,
}) => {
  const theme = useTheme();
  return (
    <Box>
      <Typography
        variant="body1"
        sx={{
          fontSize: theme.spacing(fontSize),
          textAlign: 'start',
          color: color?.labelColor,
        }}
      >
        {label}
      </Typography>
      <TextField
        value={value}
        onChange={onChange}
        fullWidth
        variant="outlined"
        sx={{ mb: 2, bgcolor: color?.backgroundInputColor, borderRadius: 1 }}
        InputProps={{
          style: { color: color?.textColor, fontSize: theme.spacing(fontSize) },
        }}
      />
    </Box>
  );
};
