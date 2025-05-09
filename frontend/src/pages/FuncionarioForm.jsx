import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box, Typography, MenuItem, FormControl, InputLabel, Select, Toolbar } from '@mui/material';
import IMaskInputWrapper from '../components/IMaskInputWrapper';
import { createFuncionario, updateFuncionario, getFuncionarioById } from '../services/funcionarioService';
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import '../styles/FuncionarioForm.css';
import { getFuncionarioByCPF } from '../services/funcionarioService';

const FuncionarioForm = () => {

    const { id, opr } = useParams();
    const navigate = useNavigate();
    const { control, handleSubmit, reset, formState: { errors } } = useForm();
    const isReadOnly = opr === 'view';

    const showCPFExistenteToast = (funcionario, onEdit, onView) => {
        toast(
            <Box>
                <Typography variant="subtitle1">
                    O CPF já está cadastrado para <strong>{funcionario.nome}</strong>.
                </Typography>
                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button variant="contained" color="primary" size="small" onClick={() => { toast.dismiss(); onEdit(); }}>
                        Editar
                    </Button>
                    <Button variant="outlined" color="secondary" size="small" onClick={() => { toast.dismiss(); onView(); }}>
                        Visualizar
                    </Button>
                    <Button variant="outlined" color="error" size="small" onClick={() => { toast.dismiss(); onCancel(); }}>
                        Cancelar
                    </Button>
                </Box>
            </Box>,
            {
                position: "top-center",
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                closeButton: false,
            }
        );
    };

    const handleCPF = async (cpfDigitado) => {
        if (!cpfDigitado || opr === 'view') return;

        try {
            const funcionarioExistente = await getFuncionarioByCPF(cpfDigitado);

            if (funcionarioExistente) {
                const idExistente = funcionarioExistente.id_funcionario;

                if (idExistente && (!id || parseInt(id) !== idExistente)) {
                    showCPFExistenteToast(funcionarioExistente,
                        () => navigate(`/funcionario/edit/${idExistente}`),
                        () => navigate(`/funcionario/view/${idExistente}`),
                        () => navigate('/funcionarios')
                    );
                }
            }
        } catch (error) {
            console.error("Erro ao verificar CPF:", error);
            toast.error("Erro ao verificar CPF existente.");
        }
    };

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

                <Controller
                    name="nome"
                    control={control}
                    defaultValue=""
                    rules={{
                        required: "Nome é obrigatório",
                        maxLength: { value: 100, message: "Máximo de 100 caracteres" }
                    }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            disabled={isReadOnly}
                            label="Nome"
                            fullWidth
                            margin="normal"
                            error={!!errors.nome}
                            helperText={errors.nome?.message}
                            inputProps={{ maxLength: 100 }}
                        />
                    )}
                />

                {/* CPF com máscara */}
                <Controller name="cpf" control={control} defaultValue="" rules={{ required: "CPF é obrigatório" }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            disabled={isReadOnly}
                            label="CPF"
                            fullWidth
                            margin="normal"
                            error={!!errors.cpf}
                            helperText={errors.cpf?.message}
                            onBlur={() => handleCPF(field.value)} // <-- validação aqui
                            InputProps={{
                                inputComponent: IMaskInputWrapper,
                                inputProps: {
                                    mask: "000.000.000-00",
                                    definitions: { "0": /\d/ },
                                    unmask: true,
                                },
                            }}
                        />
                    )}
                />

                <Controller
                    name="matricula"
                    control={control}
                    defaultValue=""
                    rules={{
                        required: "Matrícula é obrigatória",
                        maxLength: { value: 10, message: "Máximo de 10 caracteres" }
                    }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            disabled={isReadOnly}
                            label="Matrícula"
                            fullWidth
                            margin="normal"
                            error={!!errors.matricula}
                            helperText={errors.matricula?.message}
                            inputProps={{ maxLength: 10 }}
                        />)} />

                {/* Telefone com máscara */}
                <Controller
                    name="telefone"
                    control={control}
                    defaultValue=""
                    rules={{
                        required: "Telefone é obrigatório"
                    }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            disabled={isReadOnly}
                            label="Telefone"
                            fullWidth
                            margin="normal"
                            error={!!errors.telefone}
                            helperText={errors.telefone?.message}
                            InputProps={{
                                inputComponent: IMaskInputWrapper,
                                inputProps: {
                                    mask: "(00) 00000.0000",
                                    definitions: {
                                        "0": /\d/,
                                    },
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
