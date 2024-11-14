import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  useTheme,
} from '@mui/material';
import { FC } from 'react';

interface CustomSelectProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  customInput?: string;
  setCustomInput?: (value: string) => void;
  customInputLabel?: string;
  textLabelColor: string;
  textColor: string;
}

export const CustomSelect: FC<CustomSelectProps> = ({
  label,
  options,
  value,
  onChange,
  customInput,
  setCustomInput,
  textLabelColor,
  textColor,
  customInputLabel = 'Especifique sua resposta',
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ position: 'relative', mb: 3, mt: 2 }}>
      <InputLabel
        shrink
        sx={{
          color: textLabelColor,
          fontSize: theme.spacing(1.8),
          position: 'absolute',
          top: '-15px',
          left: -1,
          backgroundColor: 'transparent',
          px: 0.5,
        }}
      >
        {label}
      </InputLabel>

      <FormControl
        fullWidth
        sx={{
          bgcolor: 'white',
          borderRadius: 1,
        }}
      >
        <Select
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            if (e.target.value === 'Outros' && setCustomInput)
              setCustomInput('');
          }}
          sx={{ color: textColor, fontSize: theme.spacing(1.8) }}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
          <MenuItem value="Outros">Outros</MenuItem>
        </Select>

        {value === 'Outros' && setCustomInput && (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              label={customInputLabel}
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              fullWidth
              margin="normal"
              sx={{ maxWidth: '95%' }}
              InputLabelProps={{
                shrink: true,
                style: { color: 'black', fontSize: theme.spacing(1.5) },
              }}
              InputProps={{
                style: { color: 'black', fontSize: theme.spacing(1.5) },
              }}
            />
          </Box>
        )}
      </FormControl>
    </Box>
  );
};
