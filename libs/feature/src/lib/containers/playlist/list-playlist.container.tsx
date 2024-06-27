import { Box, Button } from '@mui/material';
import { CreatePlaylistCategoryModal, ToolbarPureTV } from '../../components';
import { LayoutBase } from '../../layout';
import { useSnackbarAlert } from '../../hooks';
import { useCallback, useState } from 'react';
import { PlaylistType } from '@workspaces/domain';

export const ListPlaylistContainer = () => {
  const [categoryPopUp, setCategoryPopUp] = useState(false);
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

  const handlePopUpClose = (types: PlaylistType) => {
    switch (types) {
      case 'category':
        setCategoryPopUp(false);
        break;
    }
  };

  const handlePopUpOpen = () => {
    setCategoryPopUp(true);
  };

  return (
    <>
      <CreatePlaylistCategoryModal
        showAlert={showAlert}
        handlePopUpClose={() => handlePopUpClose('category')}
        open={categoryPopUp}
        title="Registrar Nova Categoria"
      />
      <LayoutBase title="Listagem Playlist" toolBar={<ToolbarPureTV />}>
        <Button onClick={handlePopUpOpen}>teste</Button>
      </LayoutBase>
      {SnackbarAlert}
    </>
  );
};
