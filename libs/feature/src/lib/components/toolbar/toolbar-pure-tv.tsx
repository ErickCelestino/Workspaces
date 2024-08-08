import { IconButton } from '@mui/material';
import { useAppThemeContext, useFileModal } from '../../contexts';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export const ToolbarPureTV = () => {
  const { handleOpen } = useFileModal();
  const { themeName } = useAppThemeContext();

  return (
    <IconButton onClick={handleOpen}>
      <CloudUploadIcon
        fontSize="large"
        color={themeName === 'dark' ? 'primary' : 'secondary'}
      />
    </IconButton>
  );
};
