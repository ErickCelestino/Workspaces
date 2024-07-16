import { Box, List, ListItem, ListItemText, TextField } from '@mui/material';
import { FC, useState, useEffect, useCallback } from 'react';

interface SearchComboBoxProps {
  items: string[];
  onSearch: (searchTerm: string) => void;
  onList: (page: number, pageSize: number) => string[];
  pageSize?: number;
}

export const SearchComboBox: FC<SearchComboBoxProps> = ({
  items,
  onSearch,
  onList,
  pageSize = 20,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [loadedItems, setLoadedItems] = useState<string[]>([]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
    setLoadedItems([]);
  };

  const loadItems = useCallback(() => {
    const newItems = onList(page, pageSize);
    setLoadedItems((prevItems) => [...prevItems, ...newItems]);
  }, [page, pageSize, onList]);

  useEffect(() => {
    onSearch(searchTerm);
    loadItems();
  }, [searchTerm, page, onSearch, loadItems]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
        {loadedItems.map((item, index) => (
          <ListItem key={index}>
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
