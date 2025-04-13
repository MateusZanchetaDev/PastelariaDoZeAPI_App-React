import React from "react";
import { Box, Typography, Toolbar } from "@mui/material";
import '../styles/Home.css'

const Home = () => {
    return (
        <Box className="Home-Container" sx={{ backgroundColor: '#ADD8E6', padding: 1, borderRadius: 1, mt: 2 }}>
            
            <Toolbar sx={{ backgroundColor: '#ADD8E6', padding: 1, borderRadius: 2, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" color="primary">Home</Typography>
            </Toolbar>
            
            <Box sx={{ backgroundColor: 'white', padding: 2, borderRadius: 3, mb: 2 }}>
                
                <Typography variant="body1" color="textPrimary">
                    Bem-vindo ao aplicativo Comandas!
                </Typography>
               
                <Typography variant="body1" color="textSecondary">
                    Explore as funcionalidades e aproveite sua experiência.
                </Typography>
                
                <Typography variant="body1" color="textDisabled">
                    {`Data atual: ${new Date().toLocaleDateString()}`}
                </Typography>
            </Box>

        </Box>
    );
};
export default Home;