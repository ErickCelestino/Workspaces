import { Avatar, Box, IconButton, useTheme } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { FC } from 'react';

interface UserProfileImageProps {
  height?: number;
  imageHeight?: number;
  imageWidth?: number;
  image: string;
  editProfile: () => void;
}

export const UserProfileImage: FC<UserProfileImageProps> = ({
  height = 15,
  image,
  imageWidth = 12,
  imageHeight = 12,
  editProfile,
}) => {
  const theme = useTheme();
  return (
    <Box
      width="100%"
      marginTop={-5}
      height={theme.spacing(height)}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        sx={{
          position: 'relative',
          display: 'inline-block',
        }}
      >
        <Avatar
          sx={{
            height: theme.spacing(imageHeight),
            width: theme.spacing(imageWidth),
          }}
          src={image}
        />
        <IconButton
          onClick={editProfile}
          sx={{
            position: 'absolute',
            bottom: -10,
            right: -15,
            boxShadow: 1,
          }}
        >
          <EditIcon />
        </IconButton>
      </Box>
    </Box>
  );
};
