import React from "react";
import { Box, Typography, Toolbar } from "@mui/material";
import '../styles/NotFound.css'

const NotFound = () => {
   
    return (
        <Box className="NotFound-Container" sx={{ backgroundColor: '#ADD8E6', padding: 1, borderRadius: 1, mt: 2 }}>
            
            <Toolbar sx={{ backgroundColor: '#ADD8E6', padding: 1, borderRadius: 2, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" color="primary">404 - NotFound</Typography>
            </Toolbar>
           
            <Box sx={{ backgroundColor: 'white', padding: 2, borderRadius: 3, mb: 2 }}>
                <Typography variant="body1" color="textDisabled">
                    Página não encontrada. Verifique a URL ou retorne à página inicial.
                </Typography>
            </Box>
        </Box>
    );
};
export default NotFound;