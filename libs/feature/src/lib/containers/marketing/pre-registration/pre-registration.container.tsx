import { Box, Card, CardContent, Typography } from '@mui/material';
import { FC, useEffect } from 'react';
import { FormPreRegistration } from '../../../components';
//import { useNavigate } from "react-router-dom";

interface PreRegistrationContainerProps {
  title: string;
}

export const PreRegistrationContainer: FC<PreRegistrationContainerProps> = ({
  title,
}) => {
  //const navigate = useNavigate();

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
    >
      <Card sx={{ maxWidth: 400, padding: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography
            fontWeight={800}
            variant="h5"
            component="div"
            gutterBottom
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
        </CardContent>
      </Card>
    </Box>
  );
};
