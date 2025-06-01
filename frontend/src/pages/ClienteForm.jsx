import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box, Typography, MenuItem, FormControl, InputLabel, Select, Toolbar } from '@mui/material';
import IMaskInputWrapper from '../components/IMaskInputWrapper';
import { createCliente, updateCliente, getClienteById } from '../services/clienteService';
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import '../styles/ClienteForm.css';
import { getClienteByCPF } from '../services/clienteService';

const ClienteForm = () => {

    const { id, opr } = useParams();
    const navigate = useNavigate();
    const { control, handleSubmit, reset, formState: { errors } } = useForm();
    const isReadOnly = opr === 'view';

    const showCPFExistenteToast = (cliente, onEdit, onView) => {
        toast(
            <Box>
                <Typography variant="subtitle1">
                    O CPF já está cadastrado para <strong>{cliente.nome}</strong>.
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
            const clienteExistente = await getClienteByCPF(cpfDigitado);

            if (clienteExistente) {
                const idExistente = clienteExistente.id_cliente;

                if (idExistente && (!id || parseInt(id) !== idExistente)) {
                    showCPFExistenteToast(clienteExistente,
                        () => navigate(`/cliente/edit/${idExistente}`),
                        () => navigate(`/cliente/view/${idExistente}`),
                        () => navigate('/clientes')
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
        title = `Visualizar Cliente: ${id}`;
    } else if (id) {
        title = `Editar Cliente: ${id}`;
    } else {
        title = "Novo Cliente";
    }

    useEffect(() => {
        if (id) {

            const fetchCliente = async () => {
                const data = await getClienteById(id);

                reset(data);
            };

            fetchCliente();
        }
    }, [id, reset]);

    const onSubmit = async (data) => {
        try {
            let retorno;
            if (id) {
                retorno = await updateCliente(id, data);
            } else {
                retorno = await createCliente(data);
            }

            if (!retorno || !retorno.id) {
                throw new Error(retorno.erro || "Erro ao salvar cliente.");
            }
            toast.success(`Cliente salvo com sucesso. ID: ${retorno.id}`, { position: "top-center" });
            navigate('/clientes');
        } catch (error) {
            toast.error(`Erro ao salvar cliente: \n${error.message}`, { position: "top-center" });
        }
    };

    return (
        <Box className="ClienteForm-Container" component="form" onSubmit={handleSubmit(onSubmit)} sx={{ backgroundColor: '#ADD8E6', padding: 2, borderRadius: 1, mt: 2 }}>

            <Toolbar sx={{ backgroundColor: '#ADD8E6', padding: 1, borderRadius: 2, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" color="primary">Dados Cliente</Typography>
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

                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                    <Button onClick={() => navigate('/clientes')} sx={{ mr: 1 }}>Cancelar</Button>
                    {opr !== 'view' && (
                        <Button type="submit" variant="contained" color="primary">{id ? "Atualizar" : "Cadastrar"}</Button>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default ClienteForm;
