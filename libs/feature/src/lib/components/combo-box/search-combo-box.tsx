import { Box, TextField, Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { FC, useState, useEffect, useCallback } from 'react';

interface SearchComboBoxProps {
  onSearch: (searchTerm: string) => Promise<void>;
  onList: (
    searchTerm: string,
    page: number,
    pageSize: number
  ) => Promise<string[]>;
  pageSize?: number;
  emptyListMessage?: string;
}

export const SearchComboBox: FC<SearchComboBoxProps> = ({
  onSearch,
  onList,
  pageSize = 20,
  emptyListMessage = 'Sem Resultados',
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [opened, setOpened] = useState<boolean>(false);
  const [noResults, setNoResults] = useState<boolean>(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const loadItems = useCallback(
    async (term: string) => {
      setLoading(true);
      try {
        const newItems = await onList(term, 1, pageSize);
        setOptions(newItems);
        setNoResults(newItems.length === 0);
      } finally {
        setLoading(false);
      }
    },
    [onList, pageSize]
  );

  useEffect(() => {
    let isMounted = true;

    if (opened) {
      setLoading(true);
      loadItems('').finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [opened, loadItems]);

  useEffect(() => {
    let isMounted = true;

    if (debouncedSearchTerm && opened) {
      setLoading(true);
      loadItems(debouncedSearchTerm).finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [debouncedSearchTerm, opened, loadItems]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
  };

  const handleOpen = () => {
    if (!opened) {
      setOpened(true);
    }
  };

  useEffect(() => {
    let isMounted = true;

    if (debouncedSearchTerm && opened) {
      setLoading(true);
      onSearch(debouncedSearchTerm).finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [debouncedSearchTerm, opened, onSearch]);

  return (
    <Box>
      <Autocomplete
        options={options}
        loading={loading}
        onOpen={handleOpen}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search"
            variant="outlined"
            fullWidth
            onChange={handleSearchChange}
          />
        )}
      />
      {!loading && noResults && (
        <Typography variant="body2" color="textSecondary">
          {emptyListMessage}
        </Typography>
      )}
    </Box>
  );
};

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
