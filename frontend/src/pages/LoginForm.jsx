import React from "react";
import { useForm } from "react-hook-form";
import { Box, Button, TextField, Toolbar, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import "../styles/LoginForm.css";

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();

  const onSubmit = ({ username, password }) => login(username, password);

  return (
    <Box
      component="form"
      className="LoginForm-Container"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ backgroundColor: "#ADD8E6", p: 1, borderRadius: 1, mt: 2 }}
    >
      <Toolbar
        sx={{
          backgroundColor: "#ADD8E6",
          p: 1,
          borderRadius: 2,
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" color="primary">
          Login
        </Typography>
      </Toolbar>

      <Box sx={{ backgroundColor: "white", p: 2, borderRadius: 3, mb: 2 }}>
        <TextField
          label="Usuário (@local ou CPF)"
          fullWidth
          margin="normal"
          {...register("username", { required: "Usuário é obrigatório" })}
          error={!!errors.username}
          helperText={errors.username?.message}
        />

        <TextField
          label="Senha"
          type="password"
          fullWidth
          margin="normal"
          {...register("password", {
            required: "Senha é obrigatória",
            minLength: { value: 6, message: "Mínimo 6 caracteres" },
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        <Button type="submit" fullWidth variant="contained" color="primary">
          Entrar
        </Button>
      </Box>
    </Box>
  );
};

export default LoginForm;