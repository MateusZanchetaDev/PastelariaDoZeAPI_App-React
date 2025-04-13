import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    TextField,
    Button,
    Box,
    Typography,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Toolbar
} from '@mui/material';
import '../styles/FuncionarioForm.css';

const FuncionarioForm = () => {
    const [cpf, setCpf] = useState('');
    const [telefone, setTelefone] = useState('');
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();

    const aplicarMascaraCPF = (valor) => {
        return valor
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')  
            .replace(/(\d{3})(\d)/, '$1.$2') 
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); 
    };

    const aplicarMascaraTelefone = (valor) => {
        return valor
            .replace(/\D/g, '')  
            .replace(/^(\d{2})(\d)/, '($1) $2')  
            .replace(/(\d{5})(\d{1,4})$/, '$1-$2'); 
    };

    const handleCpfChange = (e) => {
        const valor = e.target.value;
        const valorComMascara = aplicarMascaraCPF(valor);
        setCpf(valorComMascara);
        setValue('cpf', valorComMascara);
    };

    const handleTelefoneChange = (e) => {
        const valor = e.target.value;
        const valorComMascara = aplicarMascaraTelefone(valor);
        setTelefone(valorComMascara);
        setValue('telefone', valorComMascara);  
    };

    const onSubmit = (data) => {
        console.log("Dados do funcionário:", data);
    };

    return (
        <Box className="FuncionarioForm-Container" component="form" onSubmit={handleSubmit(onSubmit)} sx={{ backgroundColor: '#ADD8E6', padding: 2, borderRadius: 1, mt: 2 }}>
            <Toolbar sx={{ backgroundColor: '#ADD8E6', padding: 1, borderRadius: 2, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" color="primary">Dados Funcionário</Typography>
            </Toolbar>

            <Box sx={{ backgroundColor: 'white', padding: 2, borderRadius: 3, mb: 2 }}>
                <TextField
                    label="Nome" fullWidth margin="normal"
                    {...register('nome', { required: 'Nome é obrigatório' })} error={!!errors.nome} helperText={errors.nome?.message}
                />
                <TextField
                    label="CPF" fullWidth margin="normal"
                    value={cpf} onChange={handleCpfChange} 
                    {...register('cpf', { required: 'CPF é obrigatório' })} error={!!errors.cpf} helperText={errors.cpf?.message}
                />
                <TextField
                    label="Matrícula" fullWidth margin="normal"
                    {...register('matricula', { required: 'Matrícula é obrigatória' })} error={!!errors.matricula} helperText={errors.matricula?.message}
                />
                <TextField
                    label="Telefone" fullWidth margin="normal"
                    value={telefone} onChange={handleTelefoneChange}  
                    {...register('telefone', { required: 'Telefone é obrigatório' })} error={!!errors.telefone} helperText={errors.telefone?.message}
                />
                <TextField
                    label="Senha" type="password" fullWidth margin="normal"
                    {...register('senha', { required: 'Senha é obrigatória', minLength: { value: 6, message: 'Senha deve ter pelo menos 6 caracteres' } })} 
                    error={!!errors.senha} helperText={errors.senha?.message}
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel id="grupo-label">Grupo</InputLabel>
                    <Select
                        labelId="grupo-label"
                        label="Grupo"
                        {...register('grupo', { required: 'Grupo é obrigatório' })}
                        error={!!errors.grupo}
                    >
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="gerente">Gerente</MenuItem>
                        <MenuItem value="funcionario">Funcionário</MenuItem>
                    </Select>
                    {errors.grupo && <p style={{ color: 'red' }}>{errors.grupo.message}</p>}
                </FormControl>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button sx={{ mr: 1 }} variant="outlined">Cancelar</Button>
                    <Button type="submit" variant="contained">Cadastrar</Button>
                </Box>
            </Box>
        </Box>
    );
};

export default FuncionarioForm;
