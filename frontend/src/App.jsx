import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Container } from "@mui/material";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./pages/Navbar";
import AppRoutes from "./routes/Router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>

      <AuthProvider>
        
        <ToastContainer position="top-center" autoClose={3000} />
        
        <Navbar className='Custom-Navbar' />

        <AppRoutes />

      </AuthProvider>

    </BrowserRouter>
  );
}
export default App;