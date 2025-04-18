import React from "react";
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box, Typography, MenuItem, FormControl, InputLabel, Select, Toolbar } from '@mui/material';
import IMaskInputWrapper from '../components/IMaskInputWrapper';
import '../styles/FuncionarioForm.css';

const FuncionarioForm = () => {
    const { control, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        console.log("Dados do funcionário:", data);
    };

    return (
        <Box className="FuncionarioForm-Container" component="form" onSubmit={handleSubmit(onSubmit)} sx={{ backgroundColor: '#ADD8E6', padding: 2, borderRadius: 1, mt: 2 }}>
            <Toolbar sx={{ backgroundColor: '#ADD8E6', padding: 1, borderRadius: 2, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" color="primary">Dados Funcionário</Typography>
            </Toolbar>

            <Box sx={{ backgroundColor: 'white', padding: 2, borderRadius: 3, mb: 2 }}>
                
                {/* Nome */}
                <Controller
                    name="nome"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Nome é obrigatório' }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Nome"
                            fullWidth
                            margin="normal"
                            error={!!errors.nome}
                            helperText={errors.nome?.message}
                            inputProps={{
                                maxLength: 100,
                            }}
                        />
                    )}
                />

                {/* CPF com máscara */}
                <Controller
                    name="cpf"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'CPF é obrigatório' }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="CPF"
                            fullWidth
                            margin="normal"
                            error={!!errors.cpf}
                            helperText={errors.cpf?.message}
                            InputProps={{
                                inputComponent: IMaskInputWrapper,
                                inputProps: {
                                    mask: "000.000.000-00",
                                    definitions: { "0": /[0-9]/ },
                                    unmask: true
                                }
                            }}
                        />
                    )}
                />

                {/* Matrícula com máscara numérica */}
                <Controller
                    name="matricula"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Matrícula é obrigatória' }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Matrícula"
                            fullWidth
                            margin="normal"
                            error={!!errors.matricula}
                            helperText={errors.matricula?.message}
                            InputProps={{
                                inputComponent: IMaskInputWrapper,
                                inputProps: {
                                    mask: "000000",
                                    definitions: { "0": /[0-9]/ },
                                    unmask: true
                                }
                            }}
                        />
                    )}
                />

                {/* Telefone com máscara */}
                <Controller
                    name="telefone"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Telefone é obrigatório' }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Telefone"
                            fullWidth
                            margin="normal"
                            error={!!errors.telefone}
                            helperText={errors.telefone?.message}
                            InputProps={{
                                inputComponent: IMaskInputWrapper,
                                inputProps: {
                                    mask: "(00) 00000-0000",
                                    definitions: { "0": /[0-9]/ },
                                    unmask: true
                                }
                            }}
                        />
                    )}
                />

                {/* Senha */}
                <Controller
                    name="senha"
                    control={control}
                    defaultValue=""
                    rules={{
                        required: 'Senha é obrigatória',
                        minLength: { value: 6, message: 'Senha deve ter pelo menos 6 caracteres' }
                    }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Senha"
                            type="password"
                            fullWidth
                            margin="normal"
                            error={!!errors.senha}
                            helperText={errors.senha?.message}
                        />
                    )}
                />

                {/* Grupo com Select */}
                <FormControl fullWidth margin="normal" error={!!errors.grupo}>
                    <InputLabel id="grupo-label">Grupo</InputLabel>
                    <Controller
                        name="grupo"
                        control={control}
                        defaultValue=""
                        rules={{ required: 'Grupo é obrigatório' }}
                        render={({ field }) => (
                            <Select
                                {...field}
                                labelId="grupo-label"
                                label="Grupo"
                            >
                                <MenuItem value="admin">Admin</MenuItem>
                                <MenuItem value="gerente">Gerente</MenuItem>
                                <MenuItem value="funcionario">Funcionário</MenuItem>
                            </Select>
                        )}
                    />
                    {errors.grupo && <Typography variant="caption" color="error">{errors.grupo.message}</Typography>}
                </FormControl>

                {/* Botões */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button sx={{ mr: 1 }} variant="outlined">Cancelar</Button>
                    <Button type="submit" variant="contained">Cadastrar</Button>
                </Box>
            </Box>
        </Box>
    );
};

export default FuncionarioForm;
