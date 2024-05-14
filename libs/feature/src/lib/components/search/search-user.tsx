import { Box, Icon, IconButton, TextField } from '@mui/material';
import { FC, useState } from 'react';

interface SearchUserProps {
  placeholder: string;
  onSearch: (text: string) => void;
}

export const SearchUser: FC<SearchUserProps> = ({ placeholder, onSearch }) => {
  const [inputText, setInputText] = useState<string>('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const handleClick = () => {
    onSearch(inputText);
    setInputText('');
  };

  return (
    <Box display="flex" justifyContent="center">
      <TextField
        onChange={handleInputChange}
        fullWidth
        placeholder={placeholder}
      />
      <IconButton onClick={handleClick} color="primary" size="large">
        <Icon>search</Icon>
      </IconButton>
    </Box>
  );
};
