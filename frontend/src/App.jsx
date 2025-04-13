import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Container } from "@mui/material";
import Navbar from "./pages/Navbar";
import AppRoutes from "./routes/Router";

function App() {
  return (
    <BrowserRouter>
      <Navbar className='Custom-Navbar'/>
      
        <AppRoutes />
      
    </BrowserRouter>
  );
}
export default App;