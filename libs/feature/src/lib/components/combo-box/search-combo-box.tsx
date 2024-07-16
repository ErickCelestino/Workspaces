import { Box, List, ListItem, ListItemText, TextField } from '@mui/material';
import { FC, useState } from 'react';

interface SearchComboBoxProps {
  items: string[];
}

export const SearchComboBox: FC<SearchComboBoxProps> = ({ items }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <List>
        {filteredItems.map((item, index) => (
          <ListItem key={index}>
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
