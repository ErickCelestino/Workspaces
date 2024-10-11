import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  useTheme,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import StoreIcon from '@mui/icons-material/Store';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import {
  FormEditProfile,
  ToolbarPureTV,
  UserProfileImage,
} from '../../components';
import { LayoutBase } from '../../layout';
import { useLoggedUser } from '../../contexts';
import { useFindUserByIdData, useSnackbarAlert } from '../../hooks';

interface UserProfileContainerProps {
  userLabel?: string;
  companyLabel?: string;
}

export const UserProfileContainer: FC<UserProfileContainerProps> = ({
  userLabel = 'Perfil',
  companyLabel = 'Empresas',
}) => {
  const { loggedUser } = useLoggedUser();
  const hasLoadedUserData = useRef(false);
  const theme = useTheme();
  const { showSnackbarAlert, SnackbarAlert } = useSnackbarAlert();

  const [selectedTab, setSelectedTab] = useState(0);

  const showAlert = useCallback(
    (message: string, success: boolean) => {
      showSnackbarAlert({
        message: message,
        severity: success ? 'success' : 'error',
      });
    },
    [showSnackbarAlert]
  );

  const { getUserByIdData, userById } = useFindUserByIdData({
    showAlert,
    loggedUserId: loggedUser?.id ?? '',
  });

  const editProfile = () => {
    //aa
  };

  useEffect(() => {
    if (!hasLoadedUserData.current) {
      getUserByIdData();
      hasLoadedUserData.current = true;
    }
  }, [getUserByIdData]);

  const renderContent = () => {
    switch (selectedTab) {
      case 0:
        return (
          <FormEditProfile
            showAlert={showAlert}
            userProfileData={{
              name: userById.name,
              nickname: userById.nickname,
              birthDate: userById.birthDate ?? undefined,
            }}
          />
        );
      case 1:
        return <div>Search Content</div>;
      default:
        return null;
    }
  };

  return (
    <>
      <LayoutBase title="Perfil do Usuário" toolBar={<ToolbarPureTV />}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <UserProfileImage
            editProfile={editProfile}
            image={userById.userImage}
            height={30}
            imageHeight={20}
            imageWidth={20}
          />

          <Box sx={{ pb: 7 }}>
            <Box
              sx={{
                display: 'flex',
                width: '100%',
                justifyContent: 'center',
              }}
            >
              <BottomNavigation
                value={selectedTab}
                sx={{
                  width: theme.spacing(80),
                }}
                onChange={(event, newValue) => setSelectedTab(newValue)}
              >
                <BottomNavigationAction
                  label={userLabel}
                  icon={
                    <AccountCircleIcon
                      sx={{
                        width: theme.spacing(4),
                        height: theme.spacing(3.5),
                      }}
                    />
                  }
                />
                <BottomNavigationAction
                  label={companyLabel}
                  icon={
                    <StoreIcon
                      sx={{
                        width: theme.spacing(4),
                        height: theme.spacing(3.5),
                      }}
                    />
                  }
                />
              </BottomNavigation>
            </Box>
            <Box
              sx={{
                p: 3,
                minHeight: 'calc(100vh - 56px)',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {renderContent()}
            </Box>
          </Box>
        </Box>
      </LayoutBase>
      {SnackbarAlert}
    </>
  );
};
