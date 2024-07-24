import {
  Button,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { grey, green } from '@mui/material/colors';
import { FC } from 'react';

interface FormButtonProps {
  buttonTitle: string;
  loading: boolean;
  success: boolean;
}

export const FormButton: FC<FormButtonProps> = ({
  buttonTitle,
  loading = false,
  success = false,
}) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      '&:hover': {
        bgcolor: green[700],
      },
    }),
  };

  return (
    <Button
      type="submit"
      fullWidth
      variant="contained"
      sx={
        success
          ? buttonSx
          : {
              mt: theme.spacing(1),
              mb: theme.spacing(1),
              height: smDown ? theme.spacing(6) : theme.spacing(7),
              fontSize: smDown ? '1rem' : '1.3rem',
              bgcolor: loading ? grey[500] : 'primay',
              '&:hover': {
                bgcolor: loading ? grey[700] : 'primary',
              },
            }
      }
    >
      {buttonTitle}
      {loading && (
        <CircularProgress
          sx={{
            mt: theme.spacing(1),
            mb: theme.spacing(1),
            height: theme.spacing(8),
            color: '#fff',
            position: 'absolute',
          }}
        />
      )}
    </Button>
  );
};
