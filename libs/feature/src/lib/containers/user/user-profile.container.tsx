import { Box } from '@mui/material';
import { ToolbarPureTV, UserProfileImage } from '../../components';
import { LayoutBase } from '../../layout';

export const UserProfileContainer = () => {
  const editProfile = () => {
    //aa
  };
  return (
    <LayoutBase title="Perfil do Usuário" toolBar={<ToolbarPureTV />}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <UserProfileImage
          editProfile={editProfile}
          image=""
          height={60}
          imageHeight={20}
          imageWidth={20}
        />
      </Box>
    </LayoutBase>
  );
};
