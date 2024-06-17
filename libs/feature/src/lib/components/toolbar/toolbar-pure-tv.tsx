import { IconButton } from '@mui/material';
import { useFileModal } from '../../contexts';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export const ToolbarPureTV = () => {
  const { handleOpen } = useFileModal();

  return (
    <IconButton onClick={handleOpen}>
      <CloudUploadIcon fontSize="large" />
    </IconButton>
  );
};
