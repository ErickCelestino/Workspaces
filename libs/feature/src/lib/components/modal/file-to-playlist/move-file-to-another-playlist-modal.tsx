import { FC } from 'react';
import { SimpleFormModal } from '../simple';
import { Box, useMediaQuery, useTheme } from '@mui/material';

interface MoveFileToAnotherPlaylistModalProps {
  selectedFiles: { [key: string]: boolean };
  oldPlaylist: string;
  open: boolean;
  handlePopUpClose: () => void;
  title: string;
}

export const MoveFileToAnotherPlaylistModal: FC<
  MoveFileToAnotherPlaylistModalProps
> = ({ selectedFiles, oldPlaylist, handlePopUpClose, open, title }) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <SimpleFormModal
      height={smDown ? theme.spacing(55) : theme.spacing(53)}
      width={smDown ? '90%' : theme.spacing(80)}
      open={open}
      handlePopUpClose={handlePopUpClose}
      title={title}
    >
      <Box>teste</Box>
    </SimpleFormModal>
  );
};
