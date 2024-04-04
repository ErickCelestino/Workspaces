import { FC, useState } from 'react';
import {
  FormAuthCard,
  FormAuthConfirm,
  StepperCustomHorizontal,
} from '../../components';
import { Avatar, Box, Container, useTheme } from '@mui/material';
import { FormCreateUser } from '../../components/form-create-user';
import { FormCreateUserProps } from '@workspaces/domain';

interface CreateUserProps {
  cardImage: string;
  logo: string;
  createUserLabel?: FormCreateUserProps;
}

export const CreateUser: FC<CreateUserProps> = ({ cardImage, logo }) => {
  //const history = useNavigate();
  const theme = useTheme();
  const [step, setStep] = useState(0);

  const handleCreateUser = (stepPosition: number) => {
    setStep(stepPosition);
  };

  return (
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
            {step === 0 && <FormCreateUser onData={handleCreateUser} />}

            {step === 1 && <FormAuthConfirm />}
          </Box>
        </Box>
      </Container>
    </FormAuthCard>
  );
};
