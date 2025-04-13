import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Toolbar } from "@mui/material";
import '../styles/LoginForm.css'

const LoginForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const navigate = useNavigate();

    // evento de submit do formulário
    // o evento é disparado quando o usuário clica no botão de submit ou pressiona a tecla enter
    const onSubmit = (data) => {
        console.log("Login:", data);
        if (data.usuario == 'abc' && data.senha == 'bolinhas') {
            localStorage.setItem('loginRealizado', data.usuario);
            navigate('/home');
        } else {
            alert("Usuário ou senha inválidos!");
        }
    };

    return (
        <Box className="LoginForm-Container" component="form" onSubmit={handleSubmit(onSubmit)} sx={{ backgroundColor: '#ADD8E6', padding: 1, borderRadius: 1, mt: 2 }}>

            <Toolbar sx={{ backgroundColor: '#ADD8E6', padding: 1, borderRadius: 2, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" color="primary">Login</Typography>
            </Toolbar>

            <Box sx={{ backgroundColor: 'white', padding: 2, borderRadius: 3, mb: 2 }}>

                <TextField label="Usuário" fullWidth margin="normal" {...register('usuario', { required: 'Usuário é obrigatório' })} error={!!errors.usuario} helperText={errors.usuario?.message} />
                <TextField label="Senha" type="password" fullWidth margin="normal" {...register('senha', { required: 'Senha é obrigatória', minLength: { value: 6, message: 'Senha deve ter pelo menos 6 caracteres' } })} error={!!errors.senha} helperText={errors.senha?.message} />

                <Button type="submit" variant="contained" fullWidth color="primary">
                    Entrar
                </Button>
            </Box>
        </Box>
    );
};
export default LoginForm;