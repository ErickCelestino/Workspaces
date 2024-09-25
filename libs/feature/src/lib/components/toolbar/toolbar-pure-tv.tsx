import { Stack } from '@mui/material';
import { useFileModal, useLoggedUser } from '../../contexts';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import GroupIcon from '@mui/icons-material/Group';
import { ListUnauthorizedUsersPopper } from '../popper';
import { FC, useCallback, useState } from 'react';
import { useSnackbarAlert } from '../../hooks';
import { ToolbarButtom } from '../buttom';

interface ToolbarPureTVProps {
  uploadFileTitle?: string;
  listUserTitle?: string;
}

export const ToolbarPureTV: FC<ToolbarPureTVProps> = ({
  uploadFileTitle = 'Fazer Upload',
  listUserTitle = 'Autorizar Usuários',
}) => {
  const { loggedUser } = useLoggedUser();
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
      <Stack spacing={1} direction="row" sx={{ color: 'action.active' }}>
        <ToolbarButtom
          handleOpen={handleOpen}
          icon={<CloudUploadIcon fontSize="large" color="primary" />}
          title={uploadFileTitle}
        />

        {loggedUser?.type !== 'DEFAULT' && (
          <ToolbarButtom
            handleOpen={handleListUsersOpen}
            icon={<GroupIcon fontSize="large" color="primary" />}
            title={listUserTitle}
          />
        )}
      </Stack>
      {SnackbarAlert}
    </>
  );
};
