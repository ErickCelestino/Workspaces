import { Snackbar, Alert } from '@mui/material';
import { SnackbarAlertProps } from '@workspaces/domain';
import React from 'react';

export const SnackbarAlert: React.FC<SnackbarAlertProps> = ({
  severity = 'info',
  message = '',
  duration = 6000,
  handleClose,
  open,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        elevation={6}
        onClose={handleClose}
        severity={severity}
        variant="filled"
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
