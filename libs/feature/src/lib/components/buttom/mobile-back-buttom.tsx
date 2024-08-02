import { Icon, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const MobileBackButtom = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <IconButton onClick={handleBack}>
      <Icon>arrow_back</Icon>
    </IconButton>
  );
};
