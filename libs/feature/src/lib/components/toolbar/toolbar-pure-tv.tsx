import { IconButton } from '@mui/material';
import { useFileModal } from '../../contexts';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export const ToolbarPureTV = () => {
  const { handleOpen } = useFileModal();

  return (
    <IconButton
      sx={{
        display: 'flex',
        background: 'white',
        justifyContent: 'center',
        ':hover': {
          background: 'white',
          opacity: 0.5,
        },
      }}
      onClick={handleOpen}
    >
      <CloudUploadIcon fontSize="large" color="primary" />
    </IconButton>
  );
};
