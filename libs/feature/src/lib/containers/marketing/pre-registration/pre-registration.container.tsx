import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { FC, useEffect } from 'react';
import { FormPreRegistration } from '../../../components';

interface PreRegistrationContainerProps {
  title: string;
  textColor?: string;
  backgroundColor?: string;
  backgroundCardColor?: string;
}

export const PreRegistrationContainer: FC<PreRegistrationContainerProps> = ({
  title,
  textColor = '#fff',
  backgroundColor = '#111111',
  backgroundCardColor = 'radial-gradient(ellipse at bottom right, #700B0E, #1E1E1E, #9C1B1F, #9C1B1F, #1E1E1E, #9C1B1F)',
}) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sendingId = urlParams.get('sending_id');
    console.log(sendingId);
  }, []);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ background: backgroundColor }}
    >
      {!smDown && (
        <Box
          sx={{
            position: 'relative',
            maxWidth: 450,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            borderRadius: 2,
            p: 6,
            textAlign: 'center',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: backgroundCardColor,
              opacity: 0.4,
              zIndex: 0,
            },
          }}
        >
          <Typography
            fontWeight="bold"
            variant="h5"
            component="div"
            gutterBottom
            color={textColor}
            zIndex={1}
            position="relative"
          >
            {title}
          </Typography>

          <FormPreRegistration
            nameLabel="Nome"
            companyNameLabel="Nome da Empresa"
            ladingpageUse={{
              ladingpageUseLabel: 'Para que você quer usar sua landing page?',
              ladingpageUseList: [
                'Gerar vendas',
                'Capturar contatos (leads)',
                'Divulgar algo (evento, marca, etc.)',
              ],
            }}
            ladingPageemphasis={{
              ladingPageemphasisLabel:
                'Você já sabe o que gostaria de destacar na sua landing page?',
              ladingPageemphasisList: [
                'Sim, já tenho uma ideia clara.',
                'Tenho algumas ideias, mas preciso de orientação.',
                'Não, preciso de ajuda desde o início.',
              ],
            }}
          />
        </Box>
      )}

      {smDown && (
        <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '80%' }}>
          <Typography
            fontWeight="bold"
            variant="h5"
            component="div"
            gutterBottom
            color={textColor}
          >
            {title}
          </Typography>

          <FormPreRegistration
            nameLabel="Nome"
            companyNameLabel="Nome da Empresa"
            textColor={textColor}
            ladingpageUse={{
              ladingpageUseLabel: 'Para que você quer usar sua landing page?',
              ladingpageUseList: [
                'Gerar vendas',
                'Capturar contatos (leads)',
                'Divulgar algo (evento, marca, etc.)',
              ],
            }}
            ladingPageemphasis={{
              ladingPageemphasisLabel:
                'Você já sabe o que gostaria de destacar na sua landing page?',
              ladingPageemphasisList: [
                'Sim, já tenho uma ideia clara.',
                'Tenho algumas ideias, mas preciso de orientação.',
                'Não, preciso de ajuda desde o início.',
              ],
            }}
          />
        </Box>
      )}
    </Box>
  );
};
