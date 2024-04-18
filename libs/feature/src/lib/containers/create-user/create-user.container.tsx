import { FC, useState } from 'react';
import {
  FormAuthCard,
  FormAuthConfirm,
  StepperCustomHorizontal,
} from '../../components';
import { Avatar, Box, Container, useTheme } from '@mui/material';
import { FormCreateUser } from '../../components';
import { FormCreateUserProps } from '@workspaces/domain';
import { useSnackbarAlert } from '../../hooks';

interface CreateUserProps {
  cardImage: string;
  logo: string;
  createUserLabel?: FormCreateUserProps;
}

export const CreateUser: FC<CreateUserProps> = ({ cardImage, logo }) => {
  const { showSnackbarAlert, SnackbarAlert } = useSnackbarAlert();
  const theme = useTheme();
  const [step, setStep] = useState(0);

  const handleCreateUser = (stepPosition: number) => {
    setStep(stepPosition);
  };

  const showErrorAlert = (message: string) => {
    showSnackbarAlert({
      message: message,
      severity: 'error',
    });
  };

  return (
    <>
      <FormAuthCard imageUrl={cardImage}>
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar
              sx={{
                mb: theme.spacing(1),
                bgcolor: 'secondary.main',
                height: theme.spacing(15),
                width: theme.spacing(15),
              }}
              src={logo}
            />
            <Box sx={{ mt: 1 }}>
              <StepperCustomHorizontal activeStep={step} />
              {step === 0 && (
                <FormCreateUser
                  onData={handleCreateUser}
                  showAlert={showErrorAlert}
                />
              )}
              {step === 1 && <FormAuthConfirm showAlert={showErrorAlert} />}
            </Box>
          </Box>
        </Container>
      </FormAuthCard>
      {SnackbarAlert}
    </>
  );
};
