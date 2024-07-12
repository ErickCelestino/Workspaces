import { FC } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { SimpleFormModal } from '../simple';

interface CreateDirectoryModalProps {
  open: boolean;
  title: string;
  handlePopUpClose: () => void;
  showAlert: (message: string, success: boolean) => void;
  nameLabel?: string;
}

export const CreateDirectoryModal: FC<CreateDirectoryModalProps> = ({
  open,
  title,
  handlePopUpClose,
  showAlert,
  nameLabel,
}) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <SimpleFormModal
      open={open}
      handlePopUpClose={handlePopUpClose}
      height={theme.spacing(63)}
      width={smDown ? '90%' : theme.spacing(80)}
      title={title}
    >
      <Box sx={{ mt: 2 }} component={'form'}></Box>
    </SimpleFormModal>
  );
};
