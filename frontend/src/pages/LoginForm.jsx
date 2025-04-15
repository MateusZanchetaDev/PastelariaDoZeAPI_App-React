import React from "react";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { TextField, Button, Box, Typography, Toolbar } from "@mui/material";
import '../styles/LoginForm.css'

const LoginForm = () => {

    // useForm é um hook do React Hook Form que fornece métodos para gerenciar o estado do formulário
    // register é uma função que registra um campo de entrada no formulário
    // handleSubmit é uma função que lida com o envio do formulário
    // formState é um objeto que contém o estado do formulário, incluindo erros de validação
    const { register, handleSubmit, formState: { errors } } = useForm();

    // useAuth é um hook personalizado que fornece acesso ao contexto de autenticação
    // login é uma função que realiza o login do usuário
    const { login } = useAuth();

    // Função que chamada login do AuthContext ao enviar o formulário
    const onSubmit = (data) => {

        const { username, password } = data;
        login(username, password);

    };

    return (
        <Box component="form" className="LoginForm-Container" onSubmit={handleSubmit(onSubmit)} sx={{ backgroundColor: '#ADD8E6', padding: 1, borderRadius: 1, mt: 2 }}>
            <Toolbar sx={{ backgroundColor: '#ADD8E6', padding: 1, borderRadius: 2, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" color="primary">Login</Typography>
            </Toolbar>
            <Box sx={{ backgroundColor: 'white', padding: 2, borderRadius: 3, mb: 2 }}>
                <TextField label="Usuário" fullWidth margin="normal" onChange={(e) => setUsername(e.target.value)}
                    {...register('username', { required: 'Usuário é obrigatório' })} error={!!errors.username} helperText={errors.username?.message}
                />
                <TextField label="Senha" type="password" fullWidth margin="normal" onChange={(e) => setPassword(e.target.value)}
                    {...register('password', {
                        required: 'Senha é obrigatória',
                        minLength: { value: 6, message: 'Senha deve ter pelo menos 6 caracteres' }
                    })} error={!!errors.password} helperText={errors.password?.message}
                />
                <Button type="submit" variant="contained" fullWidth color="primary"> Entrar </Button>
            </Box>
        </Box>
    );
};

export default LoginForm;