import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect } from 'react';
//import { useNavigate } from "react-router-dom";

export const PreRegistrationContainer = () => {
  //const navigate = useNavigate();

  useEffect(() => {
    // Extrai o parâmetro "user_id" da URL
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
          <Typography variant="h5" component="div" gutterBottom>
            Preencha o Formulário
          </Typography>

          {/* Campos do formulário */}
          <Box component="form" noValidate autoComplete="off">
            <TextField
              label="Nome"
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <TextField
              label="Mensagem"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              margin="normal"
            />
          </Box>
        </CardContent>

        <CardActions>
          <Button variant="contained" color="primary" fullWidth>
            Enviar
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};
