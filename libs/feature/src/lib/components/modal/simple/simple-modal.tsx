import { useTheme, Modal, Typography, css, styled, Box } from '@mui/material';
import { grey } from '@mui/material/colors';
import { FC, ReactNode } from 'react';

interface SimpleModalProps {
  title: string;
  description: string;
  width: number;
  height: number;
  children: ReactNode;
  open: boolean;
  close: () => void;
}

export const SimpleModal: FC<SimpleModalProps> = ({
  title,
  description,
  width,
  height,
  children,
  open,
  close,
}) => {
  const theme = useTheme();
  return (
    <Modal
      open={open}
      onClose={close}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
    >
      <ModalContent
        sx={[
          style,
          { width: theme.spacing(width), height: theme.spacing(height) },
        ]}
      >
        <Typography
          sx={{
            display: 'flex',
            margin: 0,
            lineHeight: '1.5rem',
            marginBottom: '8px',
            fontWeight: 800,
            justifyContent: 'center',
          }}
          variant="h4"
        >
          {title}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            lineHeight: '1.5rem',
            fontWeight: 400,
            marginBottom: '4px',
          }}
        >
          {description}
        </Typography>

        <Box display="flex" justifyContent="center">
          {children}
        </Box>
      </ModalContent>
    </Modal>
  );
};

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
};

const ModalContent = styled('div')(
  ({ theme }) => css`
    font-family: 'IBM Plex Sans', sans-serif;
    font-weight: 500;
    text-align: start;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;
    background-color: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border-radius: 8px;
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0 4px 12px
      ${theme.palette.mode === 'dark' ? 'rgb(0 0 0 / 0.5)' : 'rgb(0 0 0 / 0.2)'};
    padding: 24px;
    color: ${theme.palette.mode === 'dark' ? grey[50] : grey[900]};
  `
);
