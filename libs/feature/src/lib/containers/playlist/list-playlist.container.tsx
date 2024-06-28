import { Box, Button } from '@mui/material';
import { CreatePlaylistCategoryModal, ToolbarPureTV } from '../../components';
import { LayoutBase } from '../../layout';
import { useSnackbarAlert } from '../../hooks';
import { useCallback, useState } from 'react';

export const ListPlaylistContainer = () => {
  const { showSnackbarAlert, SnackbarAlert } = useSnackbarAlert();

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
      <LayoutBase title="Listagem Playlist" toolBar={<ToolbarPureTV />}>
        <Box>Playlist</Box>
      </LayoutBase>
      {SnackbarAlert}
    </>
  );
};
