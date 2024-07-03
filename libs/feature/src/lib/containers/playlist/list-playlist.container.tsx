import { Box, IconButton, useTheme } from '@mui/material';
import { CreatePlaylistModal, ToolbarPureTV } from '../../components';
import { LayoutBase } from '../../layout';
import { useSnackbarAlert } from '../../hooks';
import { useCallback, useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { CrudType } from '@workspaces/domain';

export const ListPlaylistContainer = () => {
  const { showSnackbarAlert, SnackbarAlert } = useSnackbarAlert();
  const theme = useTheme();

  const [createPlaylistPopUp, setCreatePlaylistPopUp] = useState(false);

  const handlePopUpClose = (types: CrudType) => {
    switch (types) {
      case 'create':
        setCreatePlaylistPopUp(false);
        break;
    }
  };

  const handlePopUpOpen = (types: CrudType, id?: string) => {
    switch (types) {
      case 'create':
        setCreatePlaylistPopUp(true);
        break;
    }
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
      <CreatePlaylistModal
        handlePopUpClose={() => handlePopUpClose('create')}
        showAlert={showAlert}
        open={createPlaylistPopUp}
        title="Criar Playlist"
      />
      <LayoutBase title="Listagem Playlist" toolBar={<ToolbarPureTV />}>
        <Box>
          <IconButton
            onClick={() => handlePopUpOpen('create')}
            sx={{
              width: theme.spacing(8),
              height: theme.spacing(8),
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
        </Box>
      </LayoutBase>
      {SnackbarAlert}
    </>
  );
};
