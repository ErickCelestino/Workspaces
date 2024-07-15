import {
  Icon,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  useTheme,
} from '@mui/material';
import { IconMenuItem } from '@workspaces/domain';
import { FC, useState } from 'react';
import React from 'react';

interface MobileButtonMenuProps {
  iconMenuItemList: IconMenuItem[];
}

export const MobileButtonMenu: FC<MobileButtonMenuProps> = ({
  iconMenuItemList,
}) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fabStyle = {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  };
  return (
    <SpeedDial
      ariaLabel="Options"
      sx={fabStyle}
      icon={<SpeedDialIcon />}
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
    >
      {iconMenuItemList.map((item, index) => (
        <SpeedDialAction
          key={index}
          icon={<Icon>{item.icon}</Icon>}
          tooltipTitle={item.title}
          onClick={item.handleClick}
        />
      ))}
    </SpeedDial>
  );
};
