import {
  Box,
  IconButton,
  Pagination,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { FC, ReactNode } from 'react';

import { SearchBar } from '../search';

interface ContainerCardListProps {
  children: ReactNode;
  totalPage: number;
  search: {
    placeholder: string;
    searchData: (input: string) => Promise<void>;
    createPopUp?: () => void;
  };
  handleChange: (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => Promise<void>;
}

export const ContainerCardList: FC<ContainerCardListProps> = ({
  children,
  totalPage,
  search,
  handleChange,
}) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));
  const mdDown = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <Box width="95%">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              justifyContent: 'center',
              width: mdUp ? '55%' : smDown ? '80%' : mdDown ? '95%' : '80%',
              marginLeft: theme.spacing(2),
            }}
          >
            <SearchBar
              onSearch={search.searchData}
              placeholder={search.placeholder}
            />
          </Box>
          {search.createPopUp && (
            <IconButton
              onClick={search.createPopUp}
              sx={{
                width: theme.spacing(8),
                height: theme.spacing(8),
                marginLeft: theme.spacing(2),
              }}
            >
              <AddCircleIcon
                sx={{
                  width: theme.spacing(8),
                  height: theme.spacing(8),
                }}
                color="primary"
                fontSize="large"
              />
            </IconButton>
          )}
        </Box>
      </Box>

      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Box
            display="flex"
            justifyContent="center"
            mt={theme.spacing(2)}
            sx={{
              width: mdUp ? '80%' : smDown ? '94%' : mdDown ? '95%' : '80%',
            }}
          >
            {children}
          </Box>
        </Box>
        <Box width="100%" display="flex" justifyContent="center">
          <Box marginTop={theme.spacing(2)}>
            <Pagination
              count={totalPage}
              color="primary"
              onChange={handleChange}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};