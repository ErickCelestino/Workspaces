import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from '@mui/material';
import { IconMenuItem } from '@workspaces/domain';
import { FC } from 'react';

interface BaseMenuProps {
  iconMenuItemList: IconMenuItem[];
  anchorEl?: null | HTMLElement;
  setAnchorEl?: (anchorEl: null | HTMLElement) => void;
  anchorPosition?: { top: number; left: number } | null;
  setAnchorPosition?: (
    anchorPosition: { top: number; left: number } | null
  ) => void;
}

export const BaseMenu: FC<BaseMenuProps> = ({
  iconMenuItemList,
  anchorEl,
  setAnchorEl,
  anchorPosition,
  setAnchorPosition,
}) => {
  const theme = useTheme();

  const handleClose = () => {
    if (setAnchorEl) {
      setAnchorEl(null);
    } else if (setAnchorPosition) {
      setAnchorPosition(null);
    }
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl || anchorPosition)}
      onClose={handleClose}
      anchorReference={anchorPosition ? 'anchorPosition' : 'anchorEl'}
      anchorPosition={anchorPosition ? anchorPosition : undefined}
    >
      {iconMenuItemList.map((item, index) => (
        <MenuItem
          key={index}
          sx={{
            width: theme.spacing(25),
          }}
          onClick={() => {
            item.handleClick();
            handleClose();
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: -1,
            }}
          >
            <IconButton onClick={item.handleClick}>{item.icon}</IconButton>
            <Typography>{item.title}</Typography>
          </Box>
        </MenuItem>
      ))}
    </Menu>
  );
};
