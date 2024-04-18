import { useDrawerContext } from '../../contexts';
import { DrawerHeader } from './drawer-header';
import { DrawerListItem } from './drawer-list';
import { FC, ReactNode } from 'react';
import { styled, Theme, CSSObject, useTheme } from '@mui/material/styles';
import {
  Box,
  List,
  CssBaseline,
  Divider,
  useMediaQuery,
  Avatar,
} from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';

const drawerWidth = 200;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer)(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(theme.breakpoints.up('sm') && {
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
}));

interface MiniDrawerProps {
  children: ReactNode;
  image: string;
}

export const MiniDrawer: FC<MiniDrawerProps> = ({ children, image }) => {
  const theme = useTheme();
  const { isDrawerOpen, toggleDrawerOpen, drawerOptions } = useDrawerContext();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        variant={smDown ? 'temporary' : 'permanent'}
        open={isDrawerOpen}
        onClose={toggleDrawerOpen}
      >
        <DrawerHeader
          open={isDrawerOpen}
          handleDrawerClose={toggleDrawerOpen}
        />
        {isDrawerOpen && (
          <Box
            width="100%"
            marginTop={-5}
            height={theme.spacing(15)}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Avatar
              sx={{ height: theme.spacing(12), width: theme.spacing(12) }}
              src={image}
            />
          </Box>
        )}
        <Divider />
        <List component="nav">
          <DrawerListItem
            items={drawerOptions}
            open={isDrawerOpen}
            onClick={smDown ? toggleDrawerOpen : undefined}
          />
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: theme.spacing(1) }}>
        {children}
      </Box>
    </Box>
  );
};