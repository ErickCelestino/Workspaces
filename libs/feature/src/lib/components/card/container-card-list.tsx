import { Box, Pagination, useMediaQuery, useTheme } from '@mui/material';
import { SearchBar } from '../search';
import { FC, ReactNode } from 'react';

interface ContainerCardListProps {
  children: ReactNode;
  totalPage: number;
  searchData: (input: string) => Promise<void>;
  handleChange: (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => Promise<void>;
}

export const ContainerCardList: FC<ContainerCardListProps> = ({
  children,
  totalPage,
  searchData,
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
            <SearchBar onSearch={searchData} placeholder="Pesquisar Playlist" />
          </Box>
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
        <Box width="80%">
          <Box marginTop={theme.spacing(2)} display="flex" justifyContent="end">
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
