import { Box, CircularProgress, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { FC, useState, useEffect, useCallback, UIEventHandler } from 'react';

interface SearchComboBoxProps {
  onSearch: (searchTerm: string) => Promise<void>;
  onList: (
    searchTerm: string,
    page: number,
    pageSize: number
  ) => Promise<string[]>;
  pageSize?: number;
}

export const SearchComboBox: FC<SearchComboBoxProps> = ({
  onSearch,
  onList,
  pageSize = 20,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searching, setSearching] = useState<boolean>(false); // Track searching state
  const [opened, setOpened] = useState<boolean>(false); // Track if Autocomplete is opened

  const debouncedSearchTerm = useDebounce(searchTerm, 300); // Debounce search term

  const loadItems = useCallback(
    async (term: string, pageNumber: number) => {
      setLoading(true);
      try {
        const newItems = await onList(term, pageNumber, pageSize);
        return newItems;
      } finally {
        setLoading(false);
      }
    },
    [onList, pageSize]
  );

  useEffect(() => {
    if (opened && options.length === 0) {
      // Load all items when Autocomplete is opened for the first time
      setLoading(true);
      loadItems('', 1)
        .then((newItems) => {
          // Load initial items without search term
          setOptions(newItems);
        })
        .finally(() => setLoading(false));
    }
  }, [opened, options.length, loadItems]);

  useEffect(() => {
    if (debouncedSearchTerm && opened) {
      setPage(1);
      setOptions([]);
      setSearching(true);
      loadItems(debouncedSearchTerm, 1)
        .then((newItems) => {
          setOptions(newItems);
        })
        .finally(() => setSearching(false));
    }
  }, [debouncedSearchTerm, opened, loadItems]);

  useEffect(() => {
    if (page > 1 && !loading && !searching && opened) {
      loadItems(debouncedSearchTerm, page).then((newItems) => {
        setOptions((prevItems) => [...prevItems, ...newItems]);
      });
    }
  }, [page, debouncedSearchTerm, loadItems, loading, searching, opened]);

  const handleSearchChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    await onSearch(newSearchTerm);
  };

  const handleScroll: UIEventHandler<HTMLUListElement> = (event) => {
    const listboxNode = event.currentTarget;
    if (
      listboxNode.scrollTop + listboxNode.clientHeight >=
        listboxNode.scrollHeight - 100 &&
      !loading &&
      !searching &&
      opened &&
      options.length > 0
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    if (opened) {
      window.addEventListener(
        'scroll',
        handleScroll as unknown as EventListener
      );
    } else {
      window.removeEventListener(
        'scroll',
        handleScroll as unknown as EventListener
      );
    }

    return () => {
      window.removeEventListener(
        'scroll',
        handleScroll as unknown as EventListener
      );
    };
  }, [opened]);

  const handleOpen = () => {
    if (!opened) {
      setOpened(true);
    }
  };

  return (
    <Box>
      <Autocomplete
        options={options}
        loading={loading || searching} // Consider searching state as loading state
        onOpen={handleOpen} // Track when Autocomplete is opened
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search"
            variant="outlined"
            fullWidth
            onChange={handleSearchChange}
          />
        )}
        ListboxProps={{
          onScroll: handleScroll,
        }}
      />
      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

// Helper hook for debounce
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
