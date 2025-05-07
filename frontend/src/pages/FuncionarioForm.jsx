import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box, Typography, MenuItem, FormControl, InputLabel, Select, Toolbar } from '@mui/material';
import IMaskInputWrapper from '../components/IMaskInputWrapper';
import { createFuncionario, updateFuncionario, getFuncionarioById } from '../services/funcionarioService';
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import '../styles/FuncionarioForm.css';

const FuncionarioForm = () => {

    const { id, opr } = useParams();
    const navigate = useNavigate();
    const { control, handleSubmit, reset, formState: { errors } } = useForm();
    const isReadOnly = opr === 'view';

    let title;
    if (opr === 'view') {
        title = `Visualizar Funcionário: ${id}`;
    } else if (id) {
        title = `Editar Funcionário: ${id}`;
    } else {
        title = "Novo Funcionário";
    }

    useEffect(() => {
        if (id) {

            const fetchFuncionario = async () => {
                const data = await getFuncionarioById(id);

                reset(data);
            };

            fetchFuncionario();
        }
    }, [id, reset]);

    const onSubmit = async (data) => {
        try {
            let retorno;
            if (id) {
                retorno = await updateFuncionario(id, data);
            } else {
                retorno = await createFuncionario(data);
            }

            if (!retorno || !retorno.id) {
                throw new Error(retorno.erro || "Erro ao salvar funcionário.");
            }
            toast.success(`Funcionário salvo com sucesso. ID: ${retorno.id}`, { position: "top-center" });
            navigate('/funcionarios');
        } catch (error) {
            toast.error(`Erro ao salvar funcionário: \n${error.message}`, { position: "top-center" });
        }
    };

    return (
        <Box className="FuncionarioForm-Container" component="form" onSubmit={handleSubmit(onSubmit)} sx={{ backgroundColor: '#ADD8E6', padding: 2, borderRadius: 1, mt: 2 }}>

            <Toolbar sx={{ backgroundColor: '#ADD8E6', padding: 1, borderRadius: 2, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" color="primary">Dados Funcionário</Typography>
            </Toolbar>

            <Box sx={{ backgroundColor: 'white', padding: 2, borderRadius: 3, mb: 2 }}>

                {opr === 'view' && (
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                        Todos os campos estão em modo somente leitura.
                    </Typography>
                )}

                <Controller name="nome" control={control} defaultValue="" rules={{ required: "Nome é obrigatório" }}
                    render={({ field }) => (
                        <TextField {...field} disabled={isReadOnly} label="Nome" fullWidth margin="normal" error={!!errors.nome} helperText={errors.nome?.message} />
                    )}
                />
                {/* CPF com máscara */}
                <Controller name="cpf" control={control} defaultValue="" rules={{ required: "CPF é obrigatório" }}
                    render={({ field }) => (
                        <TextField {...field} disabled={isReadOnly} label="CPF" fullWidth margin="normal" error={!!errors.cpf} helperText={errors.cpf?.message}
                            InputProps={{
                                // Define o IMaskInputWrapper como o componente de entrada
                                inputComponent: IMaskInputWrapper,
                                inputProps: {
                                    mask: "000.000.000-00",
                                    // O regex [0-9] ou \d aceita apenas números de 0 a 9
                                    definitions: {
                                        "0": /\d/,
                                    },
                                    // Retorna apenas os números no valor
                                    unmask: true,
                                },
                            }}
                        />
                    )}
                />

                <Controller name="matricula" control={control} defaultValue="" rules={{ required: "Matrícula é obrigatória" }}

                    render={({ field }) => (
                        <TextField {...field} disabled={isReadOnly} label="Matrícula" fullWidth margin="normal" error={!!errors.matricula} helperText={errors.matricula?.message} />
                    )}
                />
                {/* Telefone com máscara */}
                <Controller name="telefone" control={control} defaultValue=""
                    render={({ field }) => (
                        <TextField {...field} disabled={isReadOnly} label="Telefone" fullWidth margin="normal" error={!!errors.telefone} helperText={errors.telefone?.message}
                            InputProps={{
                                // Define o IMaskInputWrapper como o componente de entrada
                                inputComponent: IMaskInputWrapper,
                                inputProps: {
                                    mask: "(00) 00000.0000",
                                    // O regex [0-9] ou \d aceita apenas números de 0 a 9
                                    definitions: {
                                        "0": /\d/,
                                    },
                                    // Retorna apenas os números no valor
                                    unmask: true,
                                },
                            }}
                        />
                    )}
                />
                <Controller name="senha" control={control} defaultValue="" rules={{ required: "Senha obrigatória", minLength: { value: 6, message: "Pelo menos 6 caracteres" } }}
                    render={({ field }) => (
                        <TextField {...field} disabled={isReadOnly} label="Senha" type="password" fullWidth margin="normal" error={!!errors.senha} helperText={errors.senha?.message} />
                    )}
                />
                <Controller name="grupo" control={control} defaultValue=""
                    render={({ field }) => (
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="grupo-label">Grupo</InputLabel>
                            <Select {...field} disabled={isReadOnly} label="Grupo" labelId="grupo-label">
                                <MenuItem value="1">Admin</MenuItem>
                                <MenuItem value="2">Atendimento Balcão</MenuItem>
                                <MenuItem value="3">Atendimento Caixa</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                />

                {/* Botões */}
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                    <Button onClick={() => navigate('/funcionarios')} sx={{ mr: 1 }}>Cancelar</Button>
                    {opr !== 'view' && (
                        <Button type="submit" variant="contained" color="primary">{id ? "Atualizar" : "Cadastrar"}</Button>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default FuncionarioForm;
