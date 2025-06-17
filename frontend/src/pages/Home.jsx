import React from "react";
import { Box, Typography, Toolbar } from "@mui/material";
import '../styles/Home.css'

const Home = () => {
  const nome = sessionStorage.getItem("nome");
  const grupo = sessionStorage.getItem("grupo");

  return (
    <Box className="Home-Container" sx={{ backgroundColor: '#ADD8E6', padding: 1, borderRadius: 1, mt: 2 }}>
      <Toolbar sx={{ backgroundColor: '#ADD8E6', padding: 1, borderRadius: 2, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" color="primary">Home</Typography>
      </Toolbar>

      <Box sx={{ backgroundColor: 'white', padding: 2, borderRadius: 3, mb: 2 }}>
        <Typography variant="body1" color="textPrimary">
          Bem-vindo ao aplicativo Comandas!
        </Typography>

        <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
          Usuário logado: <strong>{nome || "Desconhecido"}</strong>
        </Typography>

        <Typography variant="body1" color="textSecondary">
          Grupo: <strong>{grupo || "Não informado"}</strong>
        </Typography>

        <Typography variant="body2" color="textDisabled" sx={{ mt: 3 }}>
          {`Data atual: ${new Date().toLocaleDateString()}`}
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;