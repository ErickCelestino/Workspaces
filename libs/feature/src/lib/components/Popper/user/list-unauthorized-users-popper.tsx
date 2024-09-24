import { Box, Popper } from '@mui/material';
import { FC, useState } from 'react';

interface ListUnauthorizedUsersPopperProps {
  open: boolean;
  id: string;
  anchorEl: null | HTMLElement;
}

export const ListUnauthorizedUsersPopper: FC<
  ListUnauthorizedUsersPopperProps
> = ({ id, open, anchorEl }) => {
  return (
    <Box>
      <Popper id={id} open={open} anchorEl={anchorEl}>
        <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }}>AAAAA</Box>
      </Popper>
    </Box>
  );
};
