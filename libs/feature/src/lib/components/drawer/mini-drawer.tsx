import { useAppThemeContext, useDrawerContext } from '../../contexts';
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
  Button,
  Icon,
  Typography,
  IconButton,
} from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import { removeItemLocalStorage } from '../../services';

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
  logoutTitle?: string;
  themeTitle?: string;
}

export const MiniDrawer: FC<MiniDrawerProps> = ({
  children,
  image,
  logoutTitle = 'Fazer Logout',
  themeTitle = 'Alterar Tema',
}) => {
  const theme = useTheme();
  const { toggleTheme } = useAppThemeContext();
  const { isDrawerOpen, toggleDrawerOpen, drawerOptions } = useDrawerContext();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const logout = () => {
    removeItemLocalStorage('u');
    window.location.reload();
  };

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
        <Box
          sx={{
            marginTop: 'auto',
          }}
        >
          <Divider />
          {isDrawerOpen && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                padding: theme.spacing(2),
              }}
            >
              <Button
                onClick={logout}
                color="inherit"
                sx={{
                  marginBottom: theme.spacing(0.5),
                }}
                startIcon={<Icon>logout</Icon>}
              >
                <Typography>{logoutTitle}</Typography>
              </Button>

              <Button
                onClick={toggleTheme}
                color="inherit"
                startIcon={<Icon>dark_mode</Icon>}
              >
                <Typography>{themeTitle}</Typography>
              </Button>
            </Box>
          )}
          {!isDrawerOpen && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                padding: theme.spacing(1),
              }}
            >
              <IconButton onClick={toggleDrawerOpen}>
                <Icon>settings</Icon>
              </IconButton>
            </Box>
          )}
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: theme.spacing(1) }}>
        {children}
      </Box>
    </Box>
  );
};
