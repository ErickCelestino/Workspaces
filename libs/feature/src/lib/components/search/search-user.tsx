import {
  Box,
  Icon,
  IconButton,
  InputAdornment,
  TextField,
  useTheme,
} from '@mui/material';
import { FC, useState } from 'react';

interface SearchUserProps {
  placeholder: string;
  onSearch: (text: string) => void;
}

export const SearchUser: FC<SearchUserProps> = ({ placeholder, onSearch }) => {
  const [inputText, setInputText] = useState<string>('');
  const theme = useTheme();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const handleClick = () => {
    onSearch(inputText);
  };

  const handleClear = () => {
    setInputText('');
    onSearch('');
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch(inputText);
    }
  };

  return (
    <Box display="flex" justifyContent="center">
      <TextField
        value={inputText}
        onChange={handleInputChange}
        fullWidth
        onKeyDown={handleKeyPress}
        placeholder={placeholder}
        sx={{
          maxWidth: theme.spacing(140),
          '& .MuiOutlinedInput-root': {
            borderRadius: '999px',
            paddingRight: '8px',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#dfe1e5',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#c6c6c6',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4285f4',
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton onClick={handleClick}>
                <Icon>search</Icon>
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: inputText ? (
            <InputAdornment position="end">
              <IconButton onClick={handleClear}>
                <Icon>clear</Icon>
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
      />
    </Box>
  );
};
