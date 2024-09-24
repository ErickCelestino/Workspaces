import { Box, IconButton } from '@mui/material';
import { useFileModal } from '../../contexts';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import GroupIcon from '@mui/icons-material/Group';
import { ListUnauthorizedUsersPopper } from '../Popper';
import { useCallback, useState } from 'react';
import { useSnackbarAlert } from '../../hooks';

export const ToolbarPureTV = () => {
  const [listUsersPopper, setListUsersPopper] = useState(false);
  const { handleOpen } = useFileModal();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { SnackbarAlert, showSnackbarAlert } = useSnackbarAlert();

  const handleListUsersOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setListUsersPopper(!listUsersPopper);
  };

  const showAlert = useCallback(
    (message: string, success: boolean) => {
      showSnackbarAlert({
        message: message,
        severity: success ? 'success' : 'error',
      });
    },
    [showSnackbarAlert]
  );

  return (
    <>
      <ListUnauthorizedUsersPopper
        id="list-unauthorized-users"
        open={listUsersPopper}
        anchorEl={anchorEl}
        showAlert={showAlert}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <IconButton
          sx={{
            display: 'flex',
            background: 'white',
            justifyContent: 'center',
            mr: '0.5rem',
            ':hover': {
              background: 'white',
              opacity: 0.5,
            },
          }}
          onClick={handleOpen}
        >
          <CloudUploadIcon fontSize="large" color="primary" />
        </IconButton>

        <IconButton
          id="list-unauthorized-users"
          sx={{
            display: 'flex',
            background: 'white',
            justifyContent: 'center',
            ':hover': {
              background: 'white',
              opacity: 0.5,
            },
          }}
          onClick={handleListUsersOpen}
        >
          <GroupIcon fontSize="large" color="primary" />
        </IconButton>
      </Box>
      {SnackbarAlert}
    </>
  );
};
