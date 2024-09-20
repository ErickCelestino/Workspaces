import { Box, IconButton } from '@mui/material';
import { useFileModal } from '../../contexts';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import GroupIcon from '@mui/icons-material/Group';

export const ToolbarPureTV = () => {
  const { handleOpen } = useFileModal();

  return (
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
        sx={{
          display: 'flex',
          background: 'white',
          justifyContent: 'center',
          ':hover': {
            background: 'white',
            opacity: 0.5,
          },
        }}
      >
        <GroupIcon fontSize="large" color="primary" />
      </IconButton>
    </Box>
  );
};
